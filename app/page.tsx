"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const stages = [
  { value: -15, latin: "NULLA QUOTA", name: "Promptly Bankrupt", image: "/tibo-exhausted-scribe.png", note: "one prompt from financial ruin", hue: 30, finish: { hi: "#fdfbf4", mid: "#d9d5cb", deep: "#817d74", rail: "#413c37", shadow: "#201d1a" } },
  { value: -9, latin: "RATE LIMITUS", name: "The Rate-Limited", image: "/tibo-night-builder.png", note: "shift happens after midnight", hue: 38, finish: { hi: "#e8eceb", mid: "#9ba4a5", deep: "#445053", rail: "#384044", shadow: "#171b1d" } },
  { value: -3, latin: "FABER EX MACHINA", name: "Promptus Prime", image: "/tibo-systems-author.png", note: "the prompt begins to compound", hue: 45, finish: { hi: "#f0cb8a", mid: "#b57431", deep: "#633716", rail: "#533923", shadow: "#24160c" } },
  { value: 3, latin: "AGENTIUM DOMINUS", name: "Lord of the Agents", image: "/tibo-agent-commander.png", note: "many agents, one throne", hue: 51, finish: { hi: "#f4f4ef", mid: "#b8bfbe", deep: "#697274", rail: "#42494a", shadow: "#242a2b" } },
  { value: 9, latin: "CAESAR CONTEXTUS", name: "Caesar of Context", image: "/tibo-consul-of-code.png", note: "the context window bows", hue: 58, finish: { hi: "#f8e2bd", mid: "#c68e61", deep: "#71432d", rail: "#5b4134", shadow: "#2b1c16" } },
  { value: 15, latin: "CODEX MAXIMUS", name: "Codex Maximus", image: "/tibo-imperator-codicis.png", note: "veni, vidi, reset", hue: 65, finish: { hi: "#fff0ae", mid: "#d3a22b", deep: "#70440c", rail: "#594419", shadow: "#2b1d08" } },
];

type ResetEvent = {
  date: string;
  petitions: number;
  round: string;
};

type PetitionDay = {
  date: string;
  count: number;
  level: number;
  isFuture: boolean;
  reset?: ResetEvent;
};

type LedgerPayload = {
  currentCount: number;
  currentRound: number;
  days: Array<{ date: string; count: number }>;
  resets: ResetEvent[];
};

const emptyLedger: LedgerPayload = { currentCount: 0, currentRound: 1, days: [], resets: [] };

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function createPetitionHistory(days: LedgerPayload["days"], resets: ResetEvent[]): PetitionDay[] {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const firstDay = new Date(today);
  firstDay.setUTCDate(today.getUTCDate() - (52 * 7 + today.getUTCDay()));
  const countByDate = new Map(days.map((day) => [day.date, day.count]));
  const resetByDate = new Map(resets.map((event) => [event.date, event]));

  return Array.from({ length: 53 * 7 }, (_, index) => {
    const date = new Date(firstDay);
    date.setUTCDate(firstDay.getUTCDate() + index);
    const isoDate = date.toISOString().slice(0, 10);
    const isFuture = date > today;
    const reset = resetByDate.get(isoDate);
    const count = isFuture ? 0 : Number(countByDate.get(isoDate) ?? 0);
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 8 ? 2 : count < 18 ? 3 : 4;

    return { date: isoDate, count, level, isFuture, reset };
  });
}

function formatLedgerDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function signed(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function roman(value: number) {
  const numerals: Array<[number, string]> = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let remaining = Math.max(1, Math.floor(value));
  let result = "";
  for (const [amount, numeral] of numerals) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }
  return result;
}

function createSparks() {
  return Array.from({ length: 26 }, (_, index) => ({
    left: `${(5 + stableRandom(index + 811) * 90).toFixed(3)}%`,
    drift: `${Math.round(16 + stableRandom(index + 823) * 34)}px`,
    lift: `${Math.round(-7 + stableRandom(index + 839) * 14)}px`,
    duration: `${(1.25 + stableRandom(index + 853) * 1.8).toFixed(2)}s`,
    delay: `-${(stableRandom(index + 877) * 2.8).toFixed(2)}s`,
    size: `${2 + Math.round(stableRandom(index + 881) * 3)}px`,
    lane: index % 2 === 0 ? "above" : "below",
  }));
}

type LaurelLeaf = {
  id: string;
  left: number;
  top: number;
  rotation: number;
  scale: number;
  duration: string;
  delay: string;
  sway: string;
  drift: string;
  lift: string;
  releaseDelay: string;
};

function stableRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function rounded(value: number) {
  return Number(value.toFixed(4));
}

function leafMotion(id: string, index: number): Pick<LaurelLeaf, "id" | "scale" | "duration" | "delay" | "sway" | "drift" | "lift" | "releaseDelay"> {
  return {
    id,
    scale: rounded(0.78 + stableRandom(index + 17) * 0.32),
    duration: `${(2.05 + stableRandom(index + 41) * 2.65).toFixed(2)}s`,
    delay: `-${(stableRandom(index + 73) * 4.4).toFixed(2)}s`,
    sway: `${(1.15 + stableRandom(index + 101) * 4.2).toFixed(2)}deg`,
    drift: `${(1.4 + stableRandom(index + 131) * 2.8).toFixed(2)}px`,
    lift: `${((stableRandom(index + 167) - 0.5) * 1.1).toFixed(2)}px`,
    releaseDelay: `${Math.round(stableRandom(index + 193) * 180)}ms`,
  };
}

function createLaurelLayout(kind: "reset" | "rail"): LaurelLeaf[] {
  if (kind === "reset") {
    return Array.from({ length: 14 }, (_, index) => {
      const angle = (index / 14) * Math.PI * 2 + (stableRandom(index + 211) - 0.5) * 0.14;
      const radiusX = 46 + (stableRandom(index + 227) - 0.5) * 5;
      const radiusY = 45 + (stableRandom(index + 241) - 0.5) * 5;
      return {
        ...leafMotion(`reset-${index}`, index),
        left: rounded(50 + Math.cos(angle) * radiusX),
        top: rounded(50 + Math.sin(angle) * radiusY),
        rotation: rounded((angle * 180) / Math.PI + 90 + (stableRandom(index + 263) - 0.5) * 17),
      };
    });
  }

  const edgeCount = 14;
  const top = Array.from({ length: edgeCount }, (_, index) => {
    const position = 5 + (index / (edgeCount - 1)) * 90 + (stableRandom(index + 307) - 0.5) * 3.4;
    return {
      ...leafMotion(`rail-top-${index}`, index),
      left: rounded(position),
      top: rounded((stableRandom(index + 331) - 0.5) * 7),
      rotation: rounded((index < edgeCount / 2 ? -52 : 52) + (stableRandom(index + 353) - 0.5) * 21),
    };
  });
  const bottom = Array.from({ length: edgeCount }, (_, index) => {
    const position = 5 + (index / (edgeCount - 1)) * 90 + (stableRandom(index + 379) - 0.5) * 3.4;
    return {
      ...leafMotion(`rail-bottom-${index}`, index + edgeCount),
      left: rounded(position),
      top: rounded(100 + (stableRandom(index + 401) - 0.5) * 7),
      rotation: rounded((index < edgeCount / 2 ? -128 : 128) + (stableRandom(index + 431) - 0.5) * 21),
    };
  });
  const caps = [
    { ...leafMotion("rail-left-top", 28), left: -0.5, top: 31, rotation: -76 },
    { ...leafMotion("rail-left-bottom", 29), left: 0.7, top: 69, rotation: -104 },
    { ...leafMotion("rail-right-top", 30), left: 100.5, top: 37, rotation: 88 },
    { ...leafMotion("rail-right-bottom", 31), left: 99.4, top: 64, rotation: 103 },
  ];
  return [...top, ...bottom, ...caps];
}

const resetLaurelLeaves = createLaurelLayout("reset");
const railLaurelLeaves = createLaurelLayout("rail");

function LaurelCrown({ className, kind }: { className: string; kind: "reset" | "rail" }) {
  const leaves = kind === "reset" ? resetLaurelLeaves : railLaurelLeaves;
  const frameRef = useRef<HTMLSpanElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const updateSize = () => setFrameSize({ width: frame.clientWidth, height: frame.clientHeight });
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);
  const orderedLeaves = useMemo(
    () => [...leaves].sort((a, b) => Math.atan2(a.top - 50, a.left - 50) - Math.atan2(b.top - 50, b.left - 50)),
    [leaves],
  );
  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame || !frameSize.width || !frameSize.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(frameSize.width * pixelRatio);
    canvas.height = Math.round(frameSize.height * pixelRatio);
    const context = canvas.getContext("2d");
    if (!context) return;
    let animationFrame = 0;
    const draw = (time: number) => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, frameSize.width, frameSize.height);
      const points = orderedLeaves.map((leaf, index) => {
        const phase = time * 0.00072 - (leaf.left / 100) * 1.7 + stableRandom(index + 719) * 1.9;
        const gust = Math.max(0, Math.sin(phase));
        return {
          x: (leaf.left / 100) * frameSize.width + gust * (0.55 + stableRandom(index + 733) * 1.25),
          y: (leaf.top / 100) * frameSize.height + Math.sin(phase * 1.37) * (0.18 + stableRandom(index + 761) * 0.42),
        };
      });
      if (points.length > 2) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let index = 0; index < points.length; index += 1) {
          const previous = points[(index - 1 + points.length) % points.length];
          const current = points[index];
          const next = points[(index + 1) % points.length];
          const afterNext = points[(index + 2) % points.length];
          context.bezierCurveTo(
            current.x + (next.x - previous.x) / 6,
            current.y + (next.y - previous.y) / 6,
            next.x - (afterNext.x - current.x) / 6,
            next.y - (afterNext.y - current.y) / 6,
            next.x,
            next.y,
          );
        }
        context.strokeStyle = getComputedStyle(frame).color;
        context.globalAlpha = 0.55;
        context.lineWidth = 1;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
      }
      animationFrame = window.requestAnimationFrame(draw);
    };
    animationFrame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [frameSize, orderedLeaves]);
  return (
    <span className={`laurel-crown ${className}`} aria-hidden="true" ref={frameRef}>
      <canvas className="laurel-canvas" ref={canvasRef} />
      {leaves.map((leaf) => (
        <span className="laurel-anchor" key={leaf.id} style={{ left: `${leaf.left}%`, top: `${leaf.top}%`, "--leaf-rotation": `${leaf.rotation}deg`, "--release-delay": leaf.releaseDelay } as React.CSSProperties}>
          <i className="laurel-leaf" style={{ "--leaf-scale": leaf.scale, "--wind-duration": leaf.duration, "--wind-delay": leaf.delay, "--wind-sway": leaf.sway, "--wind-drift": leaf.drift, "--wind-lift": leaf.lift } as React.CSSProperties} />
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const [strength, setStrength] = useState(-15);
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState("STANDBY");
  const [ledger, setLedger] = useState<LedgerPayload>(emptyLedger);
  const [ledgerStatus, setLedgerStatus] = useState<"connecting" | "live" | "offline">("connecting");
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [sparks] = useState(createSparks);
  const resetTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const progress = (strength + 15) / 30;
  const portraitLayers = stages.map((item, index) => ({
    ...item,
    opacity: index === 0
      ? 1
      : Math.min(1, Math.max(0, (strength - stages[index - 1].value) / (item.value - stages[index - 1].value))),
  }));
  const stage = useMemo(
    () => [...stages].reverse().find((item) => strength >= item.value) ?? stages[0],
    [strength],
  );
  const stageIndex = stages.findIndex((item) => item.value === stage.value);
  const material = strength < -7 ? "plastic" : strength < 6 ? "bronze" : strength < 13 ? "silver" : "gold";
  const finish = stage.finish;
  const petitionCount = ledger.currentCount;
  const resetHistory = ledger.resets;
  const petitionHistory = useMemo(() => createPetitionHistory(ledger.days, resetHistory), [ledger.days, resetHistory]);
  const petitionMonths = useMemo(() => petitionHistory.reduce<{ label: string; column: number }[]>((markers, day, index) => {
    const month = Number(day.date.slice(5, 7)) - 1;
    if (index === 0 || day.date.slice(5, 7) !== petitionHistory[index - 1].date.slice(5, 7)) {
      markers.push({ label: monthNames[month], column: Math.floor(index / 7) + 1 });
    }
    return markers;
  }, []), [petitionHistory]);
  const historicPetitionTotal = useMemo(() => petitionHistory.reduce((sum, day) => sum + day.count, 0), [petitionHistory]);
  const latestRecordedDay = [...petitionHistory].reverse().find((day) => !day.isFuture) ?? petitionHistory[petitionHistory.length - 1];
  const selectedDay = petitionHistory.find((day) => day.date === selectedDate)
    ?? petitionHistory.find((day) => day.date === resetHistory[resetHistory.length - 1]?.date)
    ?? latestRecordedDay;

  const refreshLedger = useCallback(async () => {
    try {
      const response = await fetch("/api/ledger", { cache: "no-store" });
      if (!response.ok) throw new Error("Ledger unavailable");
      const payload = await response.json() as LedgerPayload;
      setLedger(payload);
      setLedgerStatus("live");
    } catch {
      setLedgerStatus("offline");
    }
  }, []);

  const recordPublicPetition = useCallback(async () => {
    setLedger((current) => ({ ...current, currentCount: current.currentCount + 1 }));
    try {
      const response = await fetch("/api/petition", { method: "POST" });
      if (!response.ok) throw new Error("Petition rejected");
      const payload = await response.json() as LedgerPayload;
      setLedger(payload);
      setLedgerStatus("live");
    } catch {
      setLedgerStatus("offline");
      void refreshLedger();
    }
  }, [refreshLedger]);

  useEffect(() => () => {
    if (resetTimer.current) window.clearInterval(resetTimer.current);
  }, []);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refreshLedger(), 0);
    return () => window.clearTimeout(initialRefresh);
  }, [refreshLedger]);

  useEffect(() => {
    if (!ledgerOpen) return;
    const openingRefresh = window.setTimeout(() => void refreshLedger(), 0);
    const interval = window.setInterval(() => void refreshLedger(), 12000);
    return () => {
      window.clearTimeout(openingRefresh);
      window.clearInterval(interval);
    };
  }, [ledgerOpen, refreshLedger]);

  useEffect(() => {
    if (!ledgerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLedgerOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [ledgerOpen]);

  function requestReset() {
    if (isResetting) return;
    void recordPublicPetition();
    if (strength === 15) {
      setResetStatus("IMPERIAL RESET GRANTED");
      return;
    }

    setIsResetting(true);
    setResetStatus("PETITION RECEIVED");
    const nextStage = stages.find((item) => item.value > strength)?.value ?? 15;
    let nextStrength = strength;
    resetTimer.current = window.setInterval(() => {
      nextStrength = Math.min(nextStage, nextStrength + 1);
      setStrength(nextStrength);
      setResetStatus(nextStrength < -5 ? "RESET PROPAGATING" : nextStrength < 8 ? "AUTHORITY ESCALATING" : "IMPERIAL SEAL ACTIVE");
      if (nextStrength === nextStage && resetTimer.current) {
        window.clearInterval(resetTimer.current);
        resetTimer.current = null;
        setResetStatus(nextStrength === 15 ? "RESET GRANTED" : "SEAL RECORDED");
        window.setTimeout(() => setIsResetting(false), 850);
      }
    }, 105);
  }

  return (
    <>
    <main
      className={`experience material-${material}${isResetting ? " is-resetting" : ""}${strength === 15 ? " is-maxed" : ""}`}
      style={{ "--progress": progress, "--hue": stage.hue } as React.CSSProperties}
    >
      <div className="grain" aria-hidden="true" />
      <div className="openai-watermark" aria-hidden="true">
        <img src="/openai-mark.svg" alt="" />
      </div>
      <header className="masthead">
        <div>
          <p className="eyebrow">CODEX ASCENSION</p>
          <h1>OpenAI<span>Imperium</span></h1>
        </div>
        <div className="meter-cluster">
          <div className="meter" aria-label={`Current strength ${signed(strength)}`}>
            <span>INTENSITY</span><strong>{signed(strength)}</strong><i />
          </div>
          <button
            aria-controls="petition-ledger"
            aria-expanded={ledgerOpen}
            aria-label={`Open petition and reset history. ${petitionCount.toLocaleString("en-US")} petitions awaiting reset.`}
            className="petition-trigger"
            onClick={() => setLedgerOpen(true)}
            type="button"
          >
            <span>RESET PETITIONS</span>
            <strong>{petitionCount.toLocaleString("en-US")}</strong>
            <small><i /> {ledgerStatus === "live" ? "LIVE LEDGER" : ledgerStatus === "offline" ? "RECONNECTING" : "CONNECTING"}</small>
          </button>
        </div>
      </header>

      <section className="portrait-zone" aria-label="Tibo Codex Ascension portrait">
        <div className="stage-ghost" aria-hidden="true">{stage.latin}</div>
        <div className="architecture architecture-left" aria-hidden="true" />
        <div className="architecture architecture-right" aria-hidden="true" />
        <div className="halo" aria-hidden="true" />
        <div className="portrait-frame">
          {portraitLayers.map((portrait, index) => (
            <img
              alt={`Tibo as ${portrait.name}`}
              className={`portrait ${index === 0 ? "portrait-low" : index === stages.length - 1 ? "portrait-high" : "portrait-mid"}`}
              key={portrait.name}
              src={portrait.image}
              style={{ opacity: portrait.opacity }}
            />
          ))}
          <div className="frame-lines" aria-hidden="true" />
        </div>
        <div className="readout"><div><b>{stage.latin}</b><strong>{stage.name}</strong></div></div>
      </section>

      <section className="calibrator" aria-label="Codex intensity control">
        <div className="calibrator-heading"><span>INTENSITY</span><span>{isResetting ? resetStatus : ""}</span></div>
        <div className="range-shell">
          <div className="imperial-switch" style={{ "--slider-position": progress, "--material-hi": finish.hi, "--material-mid": finish.mid, "--material-deep": finish.deep, "--rail-base": finish.rail, "--rail-shadow": finish.shadow } as React.CSSProperties}>
            <div className="indicator left" aria-hidden="true" />
            <div className="indicator right" aria-hidden="true" />
            <LaurelCrown className="rail-laurel" kind="rail" />
            <div className="rail-particles" aria-hidden="true">{sparks.map((spark, index) => <i className={spark.lane} key={`${spark.left}-${index}`} style={{ left: spark.left, width: spark.size, height: spark.size, animationDelay: spark.delay, "--drift": spark.drift, "--lift": spark.lift, "--spark-duration": spark.duration } as React.CSSProperties} />)}</div>
            <input aria-label="Codex intensity" className="strength-range" disabled={isResetting} max="15" min="-15" onChange={(event) => setStrength(Number(event.target.value))} step="1" type="range" value={strength} />
            <div className="slider-button" aria-hidden="true" />
          </div>
          <button
            aria-label="Request a theatrical visual reset"
            className={`reset-button reset-stage-${stageIndex}${isResetting ? " is-resetting" : ""}`}
            disabled={isResetting}
            onClick={requestReset}
            style={{ "--surface-top": finish.hi, "--surface-bottom": finish.mid } as React.CSSProperties}
            type="button"
          >
            <span className="reset-button-outer">
              <span className="reset-button-inner"><span>Reset</span></span>
            </span>
          </button>
        </div>
      </section>
      <footer><span>IV · VI — ASCENSION PROTOCOL</span><span>NO CROWN WITHOUT THE BUILD</span></footer>
    </main>
    {ledgerOpen && (
      <div className="ledger-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setLedgerOpen(false); }}>
        <section aria-labelledby="petition-ledger-title" aria-modal="true" className="petition-ledger" id="petition-ledger" role="dialog">
          <header className="ledger-header">
            <div>
              <p className="ledger-kicker">TABULARIUM RESETORUM · ROUND {roman(ledger.currentRound)}</p>
              <h2 id="petition-ledger-title">Petition &amp; Reset Ledger</h2>
              <p>The public record of every plea — and every mercy granted.</p>
            </div>
            <button aria-label="Close petition history" className="ledger-close" onClick={() => setLedgerOpen(false)} type="button">×</button>
          </header>

          <div className="ledger-stats" aria-label="Petition summary">
            <div><span>AWAITING RESET</span><strong>{petitionCount.toLocaleString("en-US")}</strong><small>ROUND {roman(ledger.currentRound)} · {ledgerStatus === "live" ? "LIVE" : "SYNCING"}</small></div>
            <div><span>PAST 52 WEEKS</span><strong>{historicPetitionTotal.toLocaleString("en-US")}</strong><small>RECORDED PETITIONS</small></div>
            <div><span>RESETS GRANTED</span><strong>{resetHistory.length}</strong><small>BY IMPERIAL DECREE</small></div>
          </div>

          <div className="ledger-calendar">
            <div className="calendar-scroll">
              <div className="calendar-months" aria-hidden="true">
                {petitionMonths.slice(1).map((month, index) => <span key={`${month.label}-${index}`} style={{ gridColumn: `${month.column} / span 4` }}>{month.label}</span>)}
              </div>
              <div className="calendar-layout">
                <div className="weekday-labels" aria-hidden="true"><span>MON</span><span>WED</span><span>FRI</span></div>
                <div className="contribution-grid" role="grid" aria-label="Daily reset petitions over the past 52 weeks">
                  {petitionHistory.map((day) => (
                    <button
                      aria-label={`${formatLedgerDate(day.date)}: ${day.count.toLocaleString("en-US")} petitions${day.reset ? `, Reset ${day.reset.round} granted` : ""}`}
                      className={`petition-day level-${day.level}${day.reset ? " is-reset-day" : ""}${selectedDate === day.date ? " is-selected" : ""}`}
                      disabled={day.isFuture}
                      key={day.date}
                      onClick={() => setSelectedDate(day.date)}
                      role="gridcell"
                      title={`${formatLedgerDate(day.date)} · ${day.count.toLocaleString("en-US")} petitions${day.reset ? ` · RESET ${day.reset.round} GRANTED` : ""}`}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="calendar-legend">
              <span>LESS</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>MORE</span><b><i /> RESET GRANTED</b>
            </div>
          </div>

          <div className="ledger-detail">
            <div>
              <span>SELECTED DATE</span>
              <strong>{formatLedgerDate(selectedDay.date)}</strong>
            </div>
            <div>
              <span>PETITIONS</span>
              <strong>{selectedDay.count.toLocaleString("en-US")}</strong>
            </div>
            <div className={selectedDay.reset ? "decree granted" : "decree"}>
              <span>IMPERIAL DECREE</span>
              <strong>{selectedDay.reset ? `RESET ${selectedDay.reset.round} GRANTED` : "THE PLEAS CONTINUE"}</strong>
            </div>
          </div>

          <div className="reset-records">
            <div className="record-heading"><span>GRANTED RESETS</span><span>THE ARCHIVE REMEMBERS</span></div>
            <ol>
              {[...resetHistory].reverse().map((event) => (
                <li key={event.date}>
                  <button onClick={() => setSelectedDate(event.date)} type="button">
                    <b>{event.round}</b><span><strong>RESET GRANTED</strong><small>{formatLedgerDate(event.date)}</small></span><em>{event.petitions.toLocaleString("en-US")} pleas answered</em>
                  </button>
                </li>
              ))}
            </ol>
            {resetHistory.length === 0 && <p className="empty-ledger-record">NO IMPERIAL RESET HAS YET BEEN GRANTED.</p>}
          </div>
        </section>
      </div>
    )}
    </>
  );
}
