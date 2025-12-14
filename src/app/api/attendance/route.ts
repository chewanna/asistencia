import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const body = await req.json();
  const id = Number(body?.id);
  const present = Boolean(body?.present);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await sql`
    INSERT INTO attendance (person_id, present, updated_at)
    VALUES (${id}, ${present}, NOW())
    ON CONFLICT (person_id)
    DO UPDATE SET present = EXCLUDED.present, updated_at = NOW();
  `;

  return NextResponse.json({ ok: true });
}
