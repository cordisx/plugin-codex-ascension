import { readLedger } from "@/db/ledger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await readLedger(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "The petition ledger is temporarily unavailable." }, { status: 503 });
  }
}
