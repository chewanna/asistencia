import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  const { rows } = await sql`
    SELECT
      p.id, p.grado, p.nombre, p.ap, p.am, p.edad, p.mesa,
      COALESCE(a.present, false) AS present
    FROM people p
    LEFT JOIN attendance a ON a.person_id = p.id
    ORDER BY p.id ASC;
  `;
  return NextResponse.json(rows);
}
