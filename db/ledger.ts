import { env } from 'cloudflare:workers';

export type LedgerSnapshot = {
  currentCount: number;
  currentRound: number;
  days: Array<{ date: string; count: number; }>;
  resets: Array<{ date: string; resetAt: string; petitions: number; round: string; }>;
};

type LedgerStateRow = {
  current_count: number;
  current_round: number;
};

type PetitionDayRow = {
  count: number;
  day: string;
};

type ResetEventRow = {
  petition_count: number;
  reset_at: string;
  round: number;
};

let schemaPromise: Promise<void> | undefined;

function database() {
  const binding = (env as unknown as { DB?: D1Database; }).DB;
  if (!binding) throw new Error('The petition ledger database is unavailable.');
  return binding;
}

function roman(value: number) {
  const numerals: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remaining = Math.max(1, Math.floor(value));
  let result = '';
  for (const [amount, numeral] of numerals) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }
  return result;
}

export async function ensureLedgerSchema() {
  if (!schemaPromise) {
    const db = database();
    const now = new Date().toISOString();
    schemaPromise = db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS ledger_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        current_round INTEGER NOT NULL DEFAULT 1 CHECK (current_round > 0),
        current_count INTEGER NOT NULL DEFAULT 0 CHECK (current_count >= 0),
        started_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS petition_days (
        day TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0)
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS reset_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        round INTEGER NOT NULL UNIQUE,
        reset_at TEXT NOT NULL,
        petition_count INTEGER NOT NULL CHECK (petition_count >= 0)
      )`),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_reset_events_reset_at ON reset_events (reset_at)'),
      db.prepare(
        'INSERT OR IGNORE INTO ledger_state (id, current_round, current_count, started_at, updated_at) VALUES (1, 1, 0, ?, ?)',
      ).bind(now, now),
      db.prepare('PRAGMA optimize'),
    ]).then(() => undefined).catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  return schemaPromise;
}

export async function readLedger(): Promise<LedgerSnapshot> {
  await ensureLedgerSchema();
  const db = database();
  const earliest = new Date();
  earliest.setUTCDate(earliest.getUTCDate() - 371);
  const earliestDay = earliest.toISOString().slice(0, 10);
  const [stateResult, dayResult, resetResult] = await db.batch([
    db.prepare('SELECT current_round, current_count FROM ledger_state WHERE id = 1'),
    db.prepare('SELECT day, count FROM petition_days WHERE day >= ? ORDER BY day ASC').bind(earliestDay),
    db.prepare('SELECT round, reset_at, petition_count FROM reset_events ORDER BY reset_at ASC'),
  ]);
  const state = stateResult.results[0] as unknown as LedgerStateRow | undefined;
  const days = dayResult.results as unknown as PetitionDayRow[];
  const resets = resetResult.results as unknown as ResetEventRow[];

  return {
    currentCount: Number(state?.current_count ?? 0),
    currentRound: Number(state?.current_round ?? 1),
    days: days.map((day) => ({ date: day.day, count: Number(day.count) })),
    resets: resets.map((reset) => ({
      date: reset.reset_at.slice(0, 10),
      resetAt: reset.reset_at,
      petitions: Number(reset.petition_count),
      round: roman(Number(reset.round)),
    })),
  };
}

export async function recordPetition() {
  await ensureLedgerSchema();
  const db = database();
  const now = new Date().toISOString();
  const day = now.slice(0, 10);
  await db.batch([
    db.prepare('INSERT INTO petition_days (day, count) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET count = count + 1')
      .bind(day),
    db.prepare('UPDATE ledger_state SET current_count = current_count + 1, updated_at = ? WHERE id = 1').bind(now),
  ]);
  return readLedger();
}

export async function grantReset() {
  await ensureLedgerSchema();
  const db = database();
  const now = new Date().toISOString();
  const state = await db.prepare('SELECT current_count FROM ledger_state WHERE id = 1').first<
    { current_count: number; }
  >();
  if (!state || Number(state.current_count) < 1) return readLedger();
  await db.batch([
    db.prepare(`INSERT INTO reset_events (round, reset_at, petition_count)
      SELECT current_round, ?, current_count FROM ledger_state WHERE id = 1 AND current_count > 0`).bind(now),
    db.prepare(`UPDATE ledger_state
      SET current_round = current_round + 1, current_count = 0, started_at = ?, updated_at = ?
      WHERE id = 1 AND current_count > 0`).bind(now, now),
  ]);
  return readLedger();
}

export function isAuthorizedReset(request: Request) {
  const configured = (env as unknown as { RESET_ADMIN_TOKEN?: string; }).RESET_ADMIN_TOKEN;
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return Boolean(configured && provided && configured === provided);
}
