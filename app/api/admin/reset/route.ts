import { grantReset, isAuthorizedReset } from '@/db/ledger';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isAuthorizedReset(request)) {
    return Response.json({ error: 'Imperial authority required.' }, { status: 403 });
  }
  try {
    return Response.json(await grantReset(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'The reset could not be granted.' }, { status: 503 });
  }
}
