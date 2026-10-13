import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const adminPass = process.env.ADMIN_PASSWORD || "1234";
    const guidancePass = process.env.GUIDANCE_PASSWORD || "admin";
    const devPass = process.env.DEV_PASSWORD || "dev123";

    if (password === devPass) {
      return NextResponse.json({
        success: true,
        role: "Yazılımcı (Geliştirici)",
        roleKey: "developer",
      });
    }

    if (password === adminPass) {
      return NextResponse.json({
        success: true,
        role: "Okul İdaresi",
        roleKey: "admin",
      });
    }

    if (password === guidancePass) {
      return NextResponse.json({
        success: true,
        role: "Rehberlik Servisi",
        roleKey: "guidance",
      });
    }

    return NextResponse.json(
      { success: false, error: "Hatalı şifre girdiniz." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Giriş işlemi sırasında hata oluştu." },
      { status: 500 }
    );
  }
}