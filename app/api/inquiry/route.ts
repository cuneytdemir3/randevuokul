import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ success: false, error: "Takip kodu girilmedi." }, { status: 400 });
    }

    const { rows } = await sql`
      SELECT 
        id::text,
        tracking_code as "trackingCode",
        date,
        slot,
        visitor_count as "visitorCount",
        city,
        district,
        institution_code as "institutionCode",
        school_name as "schoolName",
        school_type as "schoolType",
        teacher_name as "teacherName",
        phone,
        email,
        status,
        rejection_reason as "rejectionReason",
        to_char(created_at, 'YYYY-MM-DD HH24:MI') as "createdAt"
      FROM randevular
      WHERE UPPER(tracking_code) = ${code} OR UPPER(REPLACE(tracking_code, 'RND-', '')) = ${code}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, notFound: true });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}