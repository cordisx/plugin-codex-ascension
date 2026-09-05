import { readLedger } from '@/db/ledger';
import { proxyDevelopmentLedger } from '@/db/ledger-proxy';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const proxied = await proxyDevelopmentLedger('/api/ledger');
    if (proxied) return proxied;
    return Response.json(await readLedger(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'The petition ledger is temporarily unavailable.' }, { status: 503 });
  }
}
