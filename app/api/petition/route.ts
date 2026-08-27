import { recordPetition } from "@/db/ledger";
import { proxyDevelopmentLedger } from "@/db/ledger-proxy";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const proxied = await proxyDevelopmentLedger("/api/petition", { method: "POST" });
    if (proxied) return proxied;
    return Response.json(await recordPetition(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "The petition could not be recorded." }, { status: 503 });
  }
}
