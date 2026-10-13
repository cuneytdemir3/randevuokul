import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Test amaçlı: Tarayıcıdan http://localhost:3000/api/send-email adresine girildiğinde çalışır
export async function GET() {
  return sendMailLogic({
    to: process.env.SMTP_USER || "test@gmail.com",
    teacherName: "Test Öğretmen",
    schoolName: "Test Ortaokulu",
    trackingCode: "RND-TEST",
    date: "2026-11-05",
    slot: "10:00 (1. Seans)",
    status: "onaylandi",
    rejectionReason: ""
  });
}

// Panelden Onayla/Reddet butonuna basıldığında çalışır
export async function POST(req: Request) {
  const body = await req.json();
  return sendMailLogic(body);
}

async function sendMailLogic(data: any) {
  const { to, teacherName, schoolName, trackingCode, date, slot, status, rejectionReason } = data;

  console.log(">>> [E-POSTA İSTEĞİ GELDİ] Hedef:", to);

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.error(">>> [HATA] .env.local dosyasında SMTP_USER veya SMTP_PASS yok!");
    return NextResponse.json(
      { success: false, error: ".env.local dosyasında SMTP_USER veya SMTP_PASS bulunamadı!" },
      { status: 500 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user.trim(),
        pass: pass.trim().replace(/\s+/g, ""), // Boşlukları temizle
      },
    });

    const isApproved = status === "onaylandi";
    const subject = isApproved
      ? `[ONAYLANDI] Prof. Dr. Mümtaz Turhan SBL Ziyaret Randevusu (${trackingCode})`
      : `[BİLGİLENDİRME] Prof. Dr. Mümtaz Turhan SBL Randevu Talebi (${trackingCode})`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #f8fafc;">
        <h2 style="color: #0369a1; text-align: center;">Prof. Dr. Mümtaz Turhan Sosyal Bilimler Lisesi</h2>
        <p>Sayın <strong>${teacherName}</strong>,</p>
        <p><strong>${schoolName}</strong> adına oluşturduğunuz <strong>${trackingCode}</strong> nolu ziyaret randevu talebiniz değerlendirilmiştir.</p>
        
        <div style="background-color: ${isApproved ? '#ecfdf5' : '#fff1f2'}; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0; color: ${isApproved ? '#047857' : '#b91c1c'};">
            Durum: ${isApproved ? 'ONAYLANDI ✓' : 'REDDEDİLDİ ✗'}
          </h3>
          ${!isApproved && rejectionReason ? `<p style="color: #b91c1c; margin-top: 5px;">Gerekçe: ${rejectionReason}</p>` : ''}
        </div>

        <p><strong>Tarih & Seans:</strong> ${date} | ${slot}</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Prof. Dr. Mümtaz Turhan SBL" <${user}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log(">>> [E-POSTA BAŞARIYLA GİTTİ] Message ID:", info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error(">>> [SMTP GÖNDERİM HATASI]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}