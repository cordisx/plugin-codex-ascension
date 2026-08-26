import { recordPetition } from "@/db/ledger";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    return Response.json(await recordPetition(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "The petition could not be recorded." }, { status: 503 });
  }
}
