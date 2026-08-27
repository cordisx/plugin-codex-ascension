export async function proxyDevelopmentLedger(path: string, init?: RequestInit) {
  if (process.env.NODE_ENV !== "development") return undefined;
  const configuredOrigin = import.meta.env.VITE_LEDGER_API_ORIGIN?.trim();
  if (!configuredOrigin) return undefined;

  const mockResetAt = import.meta.env.VITE_MOCK_LAST_RESET_AT?.trim();
  const mockReset = mockResetAt && !Number.isNaN(new Date(mockResetAt).getTime());
  const remotePath = mockReset && path === "/api/petition" ? "/api/ledger" : path;
  const remoteInit = mockReset && path === "/api/petition" ? { method: "GET" } : init;

  const response = await fetch(new URL(remotePath, configuredOrigin), {
    ...remoteInit,
    cache: "no-store",
    headers: { "Accept": "application/json", ...remoteInit?.headers },
  });
  if (mockReset && response.ok) {
    const payload = await response.json() as {
      currentCount: number;
      currentRound: number;
      days: Array<{ date: string; count: number }>;
      resets: Array<{ date: string; resetAt?: string; petitions: number; round: string }>;
    };
    const round = Math.max(1, Number(payload.currentRound) || 1);
    const romanRound = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][round - 1] ?? String(round);
    return Response.json({
      ...payload,
      currentCount: 0,
      currentRound: round + 1,
      resets: [
        ...payload.resets,
        {
          date: mockResetAt.slice(0, 10),
          resetAt: mockResetAt,
          petitions: Number(payload.currentCount) || 0,
          round: romanRound,
        },
      ],
    }, { headers: { "Cache-Control": "no-store" } });
  }
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
