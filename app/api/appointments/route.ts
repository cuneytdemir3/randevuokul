import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Next.js'in bu veriyi önbelleğe almasını kesin olarak engeller
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
// ... kodun geri kalanı aynı
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// 1. Randevuları Listele (Admin Paneli İçin)
export async function GET() {
  try {
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
      ORDER BY id DESC;
    `;
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Randevuları çekme hatası:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. Yeni Randevu Başvurusu Kaydet (Ziyaretçi Formu İçin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      trackingCode,
      date,
      slot,
      visitorCount,
      city,
      district,
      institutionCode,
      schoolName,
      schoolType,
      teacherName,
      phone,
      email
    } = body;

    // Seans dolu mu kontrol et
    const existing = await sql`
      SELECT id FROM randevular 
      WHERE date = ${date} AND slot = ${slot} AND status != 'reddedildi'
      LIMIT 1;
    `;

    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        { success: false, error: "Seçilen seans daha önce başka bir kurum tarafından doldurulmuştur." },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      INSERT INTO randevular (
        tracking_code, date, slot, visitor_count, city, district,
        institution_code, school_name, school_type, teacher_name,
        phone, email, status, rejection_reason
      ) VALUES (
        ${trackingCode}, ${date}, ${slot}, ${visitorCount}, ${city}, ${district},
        ${institutionCode}, ${schoolName}, ${schoolType}, ${teacherName},
        ${phone}, ${email}, 'beklemede', ''
      )
      RETURNING 
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
        to_char(created_at, 'YYYY-MM-DD HH24:MI') as "createdAt";
    `;

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error: any) {
    console.error("Randevu oluşturma hatası:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. Randevu Durumu Güncelle (Onayla / Reddet)
export async function PATCH(req: Request) {
  try {
    const { id, status, rejectionReason } = await req.json();

    const { rows } = await sql`
      UPDATE randevular
      SET status = ${status}, rejection_reason = ${rejectionReason || ''}
      WHERE id = ${id}
      RETURNING id::text;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Randevu bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Durum güncelleme hatası:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}