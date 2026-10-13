"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Building2,
  Users,
  Phone,
  Mail,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  LogOut,
  ChevronRight,
  School,
  Lock,
  ArrowLeft,
  CalendarOff,
  Loader2,
  Terminal,
  SearchCheck,
  FileSpreadsheet,
  Printer
} from "lucide-react";

// İl - İlçe Listesi (İstanbul'un 39 İlçesi Dahil)
const CITIES_DATA: Record<string, string[]> = {
  "İstanbul": [
    "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy",
    "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece",
    "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa",
    "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik",
    "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli",
    "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"
  ],
  "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ"],
  "İzmir": ["Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli", "Bayraklı", "Karabağlar"],
  "Bursa": ["Nilüfer", "Osmangazi", "Yıldırım", "İnegöl", "Mudanya"],
  "Kocaeli": ["İzmit", "Gebze", "Gölcük", "Körfez", "Darıca", "Kartepe", "Başiskele"],
  "Tekirdağ": ["Süleymanpaşa", "Çorlu", "Çerkezköy", "Ergene", "Kapaklı"],
  "Edirne": ["Merkez", "Keşan", "Uzunköprü"]
};

const SCHOOL_TYPES = [
  "Devlet Ortaokulu",
  "Özel Ortaokul",
  "Devlet Lisesi (Fen / Anadolu)",
  "Özel Lise",
  "İmam Hatip Ortaokulu / Lisesi",
  "BİLSEM / Kurumsal Heyet"
];

const DEFAULT_SLOTS = [
  "10:00 (1. Seans)",
  "13:30 (2. Seans)"
];

const OFFICIAL_HOLIDAYS: Record<string, string> = {
  "01-01": "Yılbaşı Tatili",
  "04-23": "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
  "05-01": "1 Mayıs Emek ve Dayanışma Günü",
  "05-19": "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı",
  "07-15": "15 Temmuz Demokrasi ve Millî Birlik Günü",
  "08-30": "30 Ağustos Zafer Bayramı",
  "10-28": "28 Ekim Cumhuriyet Bayramı (Yarım Gün)",
  "10-29": "29 Ekim Cumhuriyet Bayramı",
  "2026-03-20": "Ramazan Bayramı Arifesi",
  "2026-03-21": "Ramazan Bayramı 1. Gün",
  "2026-03-22": "Ramazan Bayramı 2. Gün",
  "2026-03-23": "Ramazan Bayramı 3. Gün",
  "2026-05-26": "Kurban Bayramı Arifesi",
  "2026-05-27": "Kurban Bayramı 1. Gün",
  "2026-05-28": "Kurban Bayramı 2. Gün",
  "2026-05-29": "Kurban Bayramı 3. Gün",
  "2026-05-30": "Kurban Bayramı 4. Gün",
};

interface Appointment {
  id: string;
  trackingCode: string;
  date: string;
  slot: string;
  visitorCount: number;
  city: string;
  district: string;
  institutionCode: string;
  schoolName: string;
  schoolType: string;
  teacherName: string;
  phone: string;
  email: string;
  status: "beklemede" | "onaylandi" | "reddedildi";
  rejectionReason?: string;
  createdAt: string;
}

export default function SchoolAppointmentSystem() {
  const [activeModule, setActiveModule] = useState<"public" | "inquiry" | "admin">("public");

  // Randevu Veritabanı
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      trackingCode: "RND-84920",
      date: "2026-11-05",
      slot: "10:00 (1. Seans)",
      visitorCount: 35,
      city: "İstanbul",
      district: "Bahçelievler",
      institutionCode: "748921",
      schoolName: "Kültür Ortaokulu",
      schoolType: "Devlet Ortaokulu",
      teacherName: "Ahmet Yılmaz",
      phone: "05321112233",
      email: "ahmet@meb.k12.tr",
      status: "onaylandi",
      createdAt: "2026-10-01 10:30"
    },
    {
      id: "2",
      trackingCode: "RND-91244",
      date: "2026-11-05",
      slot: "13:30 (2. Seans)",
      visitorCount: 28,
      city: "İstanbul",
      district: "Bakırköy",
      institutionCode: "745120",
      schoolName: "Mehmet Akif Ortaokulu",
      schoolType: "Devlet Ortaokulu",
      teacherName: "Zeynep Kaya",
      phone: "05439998877",
      email: "zeynep@meb.k12.tr",
      status: "beklemede",
      createdAt: "2026-10-04 14:15"
    }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    date: "2026-11-05",
    slot: "",
    visitorCount: "30",
    city: "İstanbul",
    district: "",
    institutionCode: "",
    schoolName: "",
    schoolType: "Devlet Ortaokulu",
    teacherName: "",
    phone: "",
    email: ""
  });

  const [formSubmitted, setFormSubmitted] = useState<Appointment | null>(null);

  // Randevu Sorgulama State'leri
  const [inquiryCode, setInquiryCode] = useState("");
  const [inquiryResult, setInquiryResult] = useState<Appointment | null | "not_found">(null);

  // Admin & Yetki State'leri
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [targetRejectId, setTargetRejectId] = useState<string | null>(null);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleAdminLogout = () => {
    setAdminAuth(false);
    setAdminPassword("");
    setAdminRole("");
    setSelectedAppointment(null);
    setActiveModule("public");
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setAdminAuth(true);
        setAdminRole(data.role);
        setAdminPassword("");
      } else {
        setAuthError(data.error || "Hatalı şifre girdiniz.");
      }
    } catch (err) {
      setAuthError("Giriş yapılırken sunucu bağlantı hatası oluştu.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInquirySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = inquiryCode.trim().toUpperCase();
    if (!cleanQuery) return;

    const found = appointments.find(
      (app) =>
        app.trackingCode.toUpperCase() === cleanQuery ||
        app.trackingCode.replace("RND-", "").toUpperCase() === cleanQuery
    );

    setInquiryResult(found || "not_found");
  };

  const dateRestriction = useMemo(() => {
    if (!formData.date) return null;
    const selectedDate = new Date(formData.date + "T00:00:00");
    const dayOfWeek = selectedDate.getDay(); 

    const monthDay = formData.date.slice(5);
    if (OFFICIAL_HOLIDAYS[formData.date]) {
      return { isBlocked: true, reason: `Resmi Tatil (${OFFICIAL_HOLIDAYS[formData.date]}): Okulumuz ziyarete kapalıdır.` };
    }
    if (OFFICIAL_HOLIDAYS[monthDay]) {
      return { isBlocked: true, reason: `Resmi Tatil (${OFFICIAL_HOLIDAYS[monthDay]}): Okulumuz ziyarete kapalıdır.` };
    }

    if (dayOfWeek !== 2 && dayOfWeek !== 4) {
      const gunAdlari = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
      return {
        isBlocked: true,
        reason: `Okulumuz tanıtım ve ziyaretler için yalnızca Salı ve Perşembe günleri müsaittir. Seçtiğiniz gün (${gunAdlari[dayOfWeek]}) okulumuz ziyarete müsait değildir.`
      };
    }

    return null;
  }, [formData.date]);

  const bookedSlotsForSelectedDate = useMemo(() => {
    return appointments
      .filter((a) => a.date === formData.date && a.status !== "reddedildi")
      .map((a) => a.slot);
  }, [appointments, formData.date]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateRestriction?.isBlocked) {
      alert(dateRestriction.reason);
      return;
    }
    if (!formData.slot) {
      alert("Lütfen uygun bir seans seçiniz.");
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      trackingCode: `RND-${Math.floor(10000 + Math.random() * 90000)}`,
      date: formData.date,
      slot: formData.slot,
      visitorCount: parseInt(formData.visitorCount) || 1,
      city: formData.city || "İstanbul",
      district: formData.district || "Merkez",
      institutionCode: formData.institutionCode.trim(),
      schoolName: formData.schoolName.trim(),
      schoolType: formData.schoolType,
      teacherName: formData.teacherName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      status: "beklemede",
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " ")
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setFormSubmitted(newAppointment);
  };

  const handleUpdateStatus = async (id: string, newStatus: "onaylandi" | "reddedildi", reason?: string) => {
    const targetApp = appointments.find((a) => a.id === id);
    if (!targetApp) return;

    setIsSendingMail(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetApp.email,
          teacherName: targetApp.teacherName,
          schoolName: targetApp.schoolName,
          trackingCode: targetApp.trackingCode,
          date: targetApp.date,
          slot: targetApp.slot,
          status: newStatus,
          rejectionReason: reason || ""
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert("E-Posta Gönderilemedi! Hata Detayı: " + (data.error || "Sunucu hatası"));
        setIsSendingMail(false);
        return;
      }

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus, rejectionReason: reason || app.rejectionReason } : app
        )
      );

      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment((prev) =>
          prev ? { ...prev, status: newStatus, rejectionReason: reason || prev.rejectionReason } : null
        );
      }

      setNotificationMsg(`Randevu ${newStatus === "onaylandi" ? "onaylandı" : "reddedildi"} ve ${targetApp.email} adresine e-posta iletildi.`);
      setTimeout(() => setNotificationMsg(null), 5000);
    } catch (err: any) {
      alert("E-posta gönderilirken bağlantı hatası oluştu: " + err.message);
    } finally {
      setIsSendingMail(false);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = statusFilter === "all" ? true : app.status === statusFilter;
    const q = searchQuery.toLowerCase();
    return matchesStatus && (
      app.schoolName.toLowerCase().includes(q) ||
      app.teacherName.toLowerCase().includes(q) ||
      app.trackingCode.toLowerCase().includes(q) ||
      app.institutionCode.toLowerCase().includes(q)
    );
  });

  // =========================================================================
  // EXCEL ÇIKTISI ALMA (.CSV / Excel Uygun - UTF-8 BOM)
  // =========================================================================
  const exportToExcel = () => {
    if (filteredAppointments.length === 0) {
      alert("Dışa aktarılacak randevu kaydı bulunamadı.");
      return;
    }

    const headers = [
      "Takip Kodu",
      "MEB Kurum Kodu",
      "Kurum / Okul Adı",
      "Okul Türü",
      "İl",
      "İlçe",
      "Randevu Tarihi",
      "Seans",
      "Kişi Sayısı",
      "Yetkili Öğretmen",
      "Telefon",
      "E-Posta",
      "Durum",
      "Kayıt Tarihi"
    ];

    const rows = filteredAppointments.map((app) => [
      `"${app.trackingCode}"`,
      `"${app.institutionCode}"`,
      `"${app.schoolName.replace(/"/g, '""')}"`,
      `"${app.schoolType}"`,
      `"${app.city}"`,
      `"${app.district}"`,
      `"${app.date}"`,
      `"${app.slot}"`,
      `"${app.visitorCount}"`,
      `"${app.teacherName.replace(/"/g, '""')}"`,
      `"${app.phone}"`,
      `"${app.email}"`,
      `"${app.status === 'onaylandi' ? 'Onaylandı' : app.status === 'reddedildi' ? 'Reddedildi' : 'Beklemede'}"`,
      `"${app.createdAt}"`
    ]);

    // Excel'in Türkçe karakterleri düzgün açması için \uFEFF (UTF-8 BOM) eklenir
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Mumtaz_Turhan_SBL_Randevular_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // =========================================================================
  // GÜVENLİK VE İDARE ÇİZELGESİ (PDF / YAZDIR)
  // =========================================================================
  const printSecurityList = () => {
    // Sadece onaylanan randevuları çizelgeye dökelim
    const approvedList = appointments.filter((a) => a.status === "onaylandi");

    if (approvedList.length === 0) {
      alert("Yazdırılacak onaylanmış randevu bulunmamaktadır.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Tarayıcınız açılır pencereyi engelledi. Lütfen izin veriniz.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Ziyaretçi ve Güvenlik Çizelgesi - Prof. Dr. Mümtaz Turhan SBL</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 25px; color: #1e293b; font-size: 12px; }
          .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 18px; }
          .title { font-size: 16px; font-weight: bold; margin: 0; color: #0f172a; }
          .subtitle { font-size: 13px; color: #0369a1; font-weight: 600; margin-top: 4px; }
          .info { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; text-transform: uppercase; font-size: 11px; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; font-size: 11px; }
          .sign-box { width: 200px; border-top: 1px dashed #94a3b8; padding-top: 6px; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="title">T.C. MİLLÎ EĞİTİM BAKANLIĞI</p>
          <p class="title">PROF. DR. MÜMTAZ TURHAN SOSYAL BİLİMLER LİSESİ</p>
          <p class="subtitle">ONAYLANMIŞ OKUL ZİYARETLERİ GÜVENLİK & NÖBETÇİ İDARECİ ÇİZELGESİ</p>
        </div>

        <div class="info">
          <span><strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
          <span><strong>Toplam Onaylı Ziyaret:</strong> ${approvedList.length} Kurum</span>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 80px;">Takip No</th>
              <th style="width: 80px;">Tarih</th>
              <th style="width: 90px;">Seans</th>
              <th>Ziyaretçi Okul / Kurum</th>
              <th style="width: 60px;">Kişi</th>
              <th>Yetkili Öğretmen</th>
              <th style="width: 100px;">İletişim Tel</th>
              <th style="width: 80px;">Giriş Saati</th>
            </tr>
          </thead>
          <tbody>
            ${approvedList.map(item => `
              <tr>
                <td style="font-family: monospace; font-weight: bold;">${item.trackingCode}</td>
                <td>${item.date}</td>
                <td><strong>${item.slot}</strong></td>
                <td><strong>${item.schoolName}</strong><br><small style="color: #64748b;">${item.city} / ${item.district}</small></td>
                <td style="text-align: center;"><strong>${item.visitorCount}</strong></td>
                <td>${item.teacherName}</td>
                <td>${item.phone}</td>
                <td style="border: 1px dashed #94a3b8;"></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <div class="sign-box">
            Nöbetçi İdareci<br><br><br>İmza
          </div>
          <div class="sign-box">
            Güvenlik Görevlisi<br><br><br>İmza
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* BİLDİRİM TOAST */}
      {notificationMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-bounce">
          <Mail className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* ÜST BAŞLIK & MENÜ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Prof. Dr. Mümtaz Turhan SBL Logo"
                className="h-full w-auto object-contain drop-shadow-sm"
                onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
              />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight leading-tight">
                Prof. Dr. Mümtaz Turhan Sosyal Bilimler Lisesi
              </h1>
              <p className="text-xs text-sky-700 font-semibold mt-0.5">Ziyaret & Tanıtım Randevu Portalı</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModule("public")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeModule === "public" ? "bg-sky-700 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Randevu Talep Formu
            </button>

            <button
              onClick={() => {
                setActiveModule("inquiry");
                setInquiryResult(null);
                setInquiryCode("");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeModule === "inquiry" ? "bg-sky-700 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <SearchCheck className="w-4 h-4" />
              Randevu Sorgula
            </button>

            {adminAuth ? (
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Güvenli Çıkış
              </button>
            ) : (
              <button
                onClick={() => setActiveModule("admin")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeModule === "admin" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                İdare Paneli
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ANA İÇERİK */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
        {/* ========================================================================= */}
        {/* MODÜL 1: ZİYARETÇİ RANDEVU TALEP FORMU                                    */}
        {/* ========================================================================= */}
        {activeModule === "public" && (
          <div className="max-w-3xl mx-auto">
            {formSubmitted ? (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center animate-fadeIn">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Randevu Talebiniz Alındı!</h2>
                <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
                  Talebiniz incelendiğinde <strong>{formSubmitted.email}</strong> adresinize otomatik e-posta gönderilecektir.
                </p>

                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-5 inline-block text-left min-w-[300px]">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Takip Kodunuz</p>
                  <p className="text-2xl font-mono font-bold text-sky-700">{formSubmitted.trackingCode}</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-600">
                    <p><span className="text-slate-400">MEB Kurum Kodu:</span> <strong>{formSubmitted.institutionCode}</strong></p>
                    <p><span className="text-slate-400">Okul:</span> {formSubmitted.schoolName}</p>
                    <p><span className="text-slate-400">Tarih & Seans:</span> {formSubmitted.date} | {formSubmitted.slot}</p>
                    <p><span className="text-slate-400">Öğretmen:</span> {formSubmitted.teacherName}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setFormSubmitted(null);
                      setFormData({
                        date: "2026-11-05", slot: "", visitorCount: "30", city: "İstanbul",
                        district: "", institutionCode: "", schoolName: "", schoolType: "Devlet Ortaokulu",
                        teacherName: "", phone: "", email: ""
                      });
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
                  >
                    Yeni Talep Oluştur
                  </button>
                  <button
                    onClick={() => {
                      setInquiryCode(formSubmitted.trackingCode);
                      setInquiryResult(formSubmitted);
                      setActiveModule("inquiry");
                      setFormSubmitted(null);
                    }}
                    className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    <SearchCheck className="w-4 h-4" />
                    Durumu Takip Et
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="pt-6 pb-2 text-center">
                  <span className="inline-flex items-center gap-2 bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    Kurumsal (Okul) Randevu Formu
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    * Ziyaret ve okul tanıtımları yalnızca <strong>Salı</strong> ve <strong>Perşembe</strong> günleri gerçekleştirilmektedir.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-8">
                  <div>
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                      <Clock className="w-4 h-4 text-sky-700" />
                      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                        1. Randevu Zamanı (Salı & Perşembe)
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Takvimden Gün Seçiniz *
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value, slot: "" })}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:bg-white outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Seans Seçiniz *
                        </label>
                        <select
                          value={formData.slot}
                          onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                          disabled={Boolean(dateRestriction?.isBlocked)}
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:bg-white outline-none disabled:bg-slate-100 disabled:text-slate-400"
                          required
                        >
                          {dateRestriction?.isBlocked ? (
                            <option value="">Bu günde okul ziyarete uygun değildir</option>
                          ) : (
                            <>
                              <option value="">Seans Seçiniz...</option>
                              {DEFAULT_SLOTS.map((s) => {
                                const isBooked = bookedSlotsForSelectedDate.includes(s);
                                return (
                                  <option key={s} value={s} disabled={isBooked}>
                                    {s} {isBooked ? "(DOLU)" : "(Müsait)"}
                                  </option>
                                );
                              })}
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    {dateRestriction?.isBlocked ? (
                      <div className="mt-3.5 flex items-start gap-2.5 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 p-3 rounded-lg">
                        <CalendarOff className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-rose-900">Okul Müsait Değil</p>
                          <p className="mt-0.5">{dateRestriction.reason}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Müsait
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Dolu
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
                      <User className="w-4 h-4 text-sky-700" />
                      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                        2. Bilgileriniz
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Toplam Ziyaretçi Sayısı *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={formData.visitorCount}
                          onChange={(e) => setFormData({ ...formData, visitorCount: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:bg-white outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          İl *
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value, district: "" })}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:bg-white outline-none"
                          required
                        >
                          <option value="">İl Seçiniz</option>
                          {Object.keys(CITIES_DATA).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          İlçe *
                        </label>
                        <select
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          disabled={!formData.city}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:bg-white outline-none disabled:bg-slate-100"
                          required
                        >
                          <option value="">{formData.city ? "İlçe Seçiniz" : "Önce İl Seçiniz"}</option>
                          {formData.city && CITIES_DATA[formData.city]?.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                      <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          MEB Kurum Kodu *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={8}
                          placeholder="Örn: 748921"
                          value={formData.institutionCode}
                          onChange={(e) => setFormData({ ...formData, institutionCode: e.target.value.replace(/\D/g, "") })}
                          className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
                          required
                        />
                      </div>

                      <div className="md:col-span-5">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Kurum / Okul Adı *
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: Atatürk Ortaokulu"
                          value={formData.schoolName}
                          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
                          required
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Okul Türü *
                        </label>
                        <select
                          value={formData.schoolType}
                          onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
                          required
                        >
                          {SCHOOL_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Yetkili Öğretmen Adı Soyadı *
                      </label>
                      <input
                        type="text"
                        placeholder="Ad Soyad"
                        value={formData.teacherName}
                        onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Öğretmen Telefon (5XX...) *
                        </label>
                        <input
                          type="tel"
                          placeholder="05XXXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Öğretmen E-Posta (Bilgilendirme Maili İletilir) *
                        </label>
                        <input
                          type="email"
                          placeholder="ornek@meb.k12.tr"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={Boolean(dateRestriction?.isBlocked)}
                      className={`w-full py-3.5 px-4 font-semibold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition duration-150 ${
                        dateRestriction?.isBlocked
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300"
                          : "bg-slate-800 hover:bg-slate-900 text-white cursor-pointer"
                      }`}
                    >
                      <Send className="w-4 h-4 text-white" />
                      Randevu Talebini Tamamla
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODÜL 2: ÖĞRETMEN RANDEVU SORGULAMA & TAKİP MODÜLÜ                       */}
        {/* ========================================================================= */}
        {activeModule === "inquiry" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center mx-auto mb-3">
                <SearchCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800">
                Randevu Durumu Sorgulama
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Başvurunuz sırasında size iletilen <strong>Takip Kodunu</strong> girerek randevunuzun onay durumunu öğrenebilirsiniz.
              </p>

              <form onSubmit={handleInquirySearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Örn: RND-84920 veya 84920"
                  value={inquiryCode}
                  onChange={(e) => setInquiryCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-600 text-center sm:text-left"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs rounded-lg transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  Sorgula
                </button>
              </form>
            </div>

            {inquiryResult === "not_found" && (
              <div className="bg-white rounded-xl shadow-sm border border-rose-200 p-6 text-center animate-fadeIn">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">Kayıt Bulunamadı</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Girmiş olduğunuz takip koduna ait bir randevu kaydı bulunamadı. Lütfen kodunuzu kontrol ediniz.
                </p>
              </div>
            )}

            {inquiryResult && inquiryResult !== "not_found" && (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden animate-fadeIn">
                <div className={`p-4 border-b flex items-center justify-between ${
                  inquiryResult.status === "onaylandi"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : inquiryResult.status === "reddedildi"
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  <div className="flex items-center gap-2">
                    {inquiryResult.status === "onaylandi" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {inquiryResult.status === "reddedildi" && <XCircle className="w-5 h-5 text-rose-600" />}
                    {inquiryResult.status === "beklemede" && <AlertCircle className="w-5 h-5 text-amber-600" />}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Randevu Durumu</p>
                      <p className="text-sm font-bold">
                        {inquiryResult.status === "onaylandi" && "ONAYLANDI (Ziyaret Bekleniyor)"}
                        {inquiryResult.status === "reddedildi" && "REDDEDİLDİ"}
                        {inquiryResult.status === "beklemede" && "ONAY BEKLİYOR (İnceleniyor)"}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-md border shadow-2xs">
                    {inquiryResult.trackingCode}
                  </span>
                </div>

                <div className="p-6 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Ziyaret Edecek Kurum:</span>
                    <span className="font-semibold text-slate-800">{inquiryResult.schoolName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">MEB Kurum Kodu:</span>
                    <span className="font-mono font-bold text-slate-700">{inquiryResult.institutionCode}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Randevu Tarihi:</span>
                    <span className="font-semibold text-slate-800">{inquiryResult.date}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Seans Saati:</span>
                    <span className="font-semibold text-slate-800">{inquiryResult.slot}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Yetkili Öğretmen:</span>
                    <span className="text-slate-800">{inquiryResult.teacherName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Toplam Ziyaretçi:</span>
                    <span className="text-slate-800 font-semibold">{inquiryResult.visitorCount} Kişi</span>
                  </div>

                  {inquiryResult.status === "reddedildi" && inquiryResult.rejectionReason && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg mt-3">
                      <p className="font-bold">Okul İdaresi Red Gerekçesi:</p>
                      <p className="mt-0.5">{inquiryResult.rejectionReason}</p>
                    </div>
                  )}

                  {inquiryResult.status === "onaylandi" && (
                    <div className="bg-sky-50 border border-sky-200 text-sky-800 p-3 rounded-lg mt-3">
                      <p className="font-bold">Önemli Hatırlatma:</p>
                      <p className="mt-0.5">
                        Ziyaret saatinizden 10 dakika önce güvenlik noktasında hazır bulunmanızı ve MEB onaylı ziyaretçi üst yazınızı yanınızda bulundurmanızı rica ederiz.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODÜL 3: İDARE & REHBERLİK & YAZILIMCI YÖNETİM PANELİ                     */}
        {/* ========================================================================= */}
        {activeModule === "admin" && (
          <div>
            {!adminAuth ? (
              <div className="max-w-md mx-auto mt-12 bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-700">
                  <Lock className="w-6 h-6 text-sky-700" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Yönetim & Yetkili Girişi</h2>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Okul İdaresi, Rehberlik Servisi veya Sistem Geliştirici şifrenizle giriş yapınız.
                </p>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input
                    type="password"
                    placeholder="Yetkili Şifrenizi Giriniz"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (authError) setAuthError("");
                    }}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-600 text-center"
                    autoFocus
                  />

                  {authError && (
                    <p className="text-xs text-rose-600 font-semibold">{authError}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModule("public")}
                      className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                    >
                      Geri Dön
                    </button>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-2/3 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs rounded-lg transition shadow-sm cursor-pointer disabled:bg-slate-400"
                    >
                      {authLoading ? "Kontrol Ediliyor..." : "Giriş Yap"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Başlık, Rol ve Çıktı Alma Çubuğu */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold flex-shrink-0">
                      {adminRole.includes("Yazılımcı") ? (
                        <Terminal className="w-5 h-5 text-purple-600" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-800">Rehberlik & İdare Yönetim Masası</h2>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          adminRole.includes("Yazılımcı")
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : adminRole.includes("İdaresi")
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          Aktif Rol: {adminRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Ziyaretçi listesini dışa aktarabilir veya güvenlik kapısı için çizelge yazdırabilirsiniz.
                      </p>
                    </div>
                  </div>

                  {/* EXCEL, YAZDIR VE ÇIKIŞ BUTONLARI */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={exportToExcel}
                      title="Filtrelenmiş listeyi Excel uyumlu CSV olarak indirir"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition cursor-pointer shadow-2xs"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      Excel İndir
                    </button>

                    <button
                      onClick={printSecurityList}
                      title="Onaylı ziyaretçi listesini resmi kapı güvenlik formatında yazdırır / PDF yapar"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold transition cursor-pointer shadow-2xs"
                    >
                      <Printer className="w-4 h-4 text-sky-600" />
                      Güvenlik Çizelgesi (PDF)
                    </button>

                    <button
                      onClick={handleAdminLogout}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer shadow-2xs"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış
                    </button>
                  </div>
                </div>

                {/* İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Toplam Talep</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{appointments.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
                    <p className="text-xs font-semibold text-amber-600 uppercase">Onay Bekleyen</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">
                      {appointments.filter((a) => a.status === "beklemede").length}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
                    <p className="text-xs font-semibold text-emerald-600 uppercase">Onaylanan</p>
                    <p className="text-2xl font-bold text-emerald-700 mt-1">
                      {appointments.filter((a) => a.status === "onaylandi").length}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/40 shadow-sm">
                    <p className="text-xs font-semibold text-rose-600 uppercase">Reddedilen</p>
                    <p className="text-2xl font-bold text-rose-700 mt-1">
                      {appointments.filter((a) => a.status === "reddedildi").length}
                    </p>
                  </div>
                </div>

                {/* Arama & Filtre */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Kurum kodu, okul adı, öğretmen veya takip no..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    {[
                      { key: "all", label: "Tümü" },
                      { key: "beklemede", label: "Bekleyenler" },
                      { key: "onaylandi", label: "Onaylananlar" },
                      { key: "reddedildi", label: "Reddedilenler" }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          statusFilter === tab.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Randevu Tablosu */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Takip / Kurum</th>
                          <th className="py-3 px-4">Kurum Kodu</th>
                          <th className="py-3 px-4">Tarih & Seans</th>
                          <th className="py-3 px-4">Yetkili Öğretmen & E-posta</th>
                          <th className="py-3 px-4">Kişi</th>
                          <th className="py-3 px-4">Durum</th>
                          <th className="py-3 px-4 text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-400">Kayıt bulunamadı.</td>
                          </tr>
                        ) : (
                          filteredAppointments.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3 px-4">
                                <span className="font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded text-[11px]">
                                  {app.trackingCode}
                                </span>
                                <p className="font-semibold text-slate-800 mt-1">{app.schoolName}</p>
                                <p className="text-[11px] text-slate-400">{app.city} / {app.district} • {app.schoolType}</p>
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{app.institutionCode || "-"}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-slate-700">{app.date}</div>
                                <div className="text-[11px] text-slate-500">{app.slot}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-slate-800">{app.teacherName}</div>
                                <div className="text-[11px] text-sky-700 font-semibold">{app.email}</div>
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-700">{app.visitorCount} Kişi</td>
                              <td className="py-3 px-4">
                                {app.status === "onaylandi" && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                                    <CheckCircle2 className="w-3 h-3" /> Onaylandı
                                  </span>
                                )}
                                {app.status === "reddedildi" && (
                                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                                    <XCircle className="w-3 h-3" /> Reddedildi
                                  </span>
                                )}
                                {app.status === "beklemede" && (
                                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                                    <AlertCircle className="w-3 h-3" /> Beklemede
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedAppointment(app)}
                                    title="Detay Görüntüle"
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {app.status !== "onaylandi" && (
                                    <button
                                      disabled={isSendingMail}
                                      onClick={() => handleUpdateStatus(app.id, "onaylandi")}
                                      title="Onayla ve E-posta Gönder"
                                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                                    >
                                      {isSendingMail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </button>
                                  )}

                                  {app.status !== "reddedildi" && (
                                    <button
                                      disabled={isSendingMail}
                                      onClick={() => {
                                        setTargetRejectId(app.id);
                                        setRejectReason("");
                                        setRejectModalOpen(true);
                                      }}
                                      title="Reddet ve Gerekçeli Mail Gönder"
                                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer flex items-center gap-1"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DETAY MODALI */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-scaleUp">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Randevu Detayları</h3>
                <button onClick={() => setSelectedAppointment(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer">&times;</button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Takip Kodu:</span><span className="font-mono font-bold text-sky-700">{selectedAppointment.trackingCode}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">MEB Kurum Kodu:</span><span className="font-mono font-bold text-slate-800">{selectedAppointment.institutionCode}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Kurum / Okul:</span><span className="font-semibold text-slate-800">{selectedAppointment.schoolName}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Okul Türü:</span><span className="text-slate-700">{selectedAppointment.schoolType}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Konum:</span><span className="text-slate-700">{selectedAppointment.city} / {selectedAppointment.district}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Randevu Tarihi & Seansı:</span><span className="font-semibold text-slate-800">{selectedAppointment.date} | {selectedAppointment.slot}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Ziyaretçi Sayısı:</span><span className="text-slate-800 font-semibold">{selectedAppointment.visitorCount} Kişi</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Yetkili Öğretmen:</span><span className="text-slate-800 font-semibold">{selectedAppointment.teacherName}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Telefon:</span><span className="text-slate-800">{selectedAppointment.phone}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span className="text-slate-400">Öğretmen E-Posta:</span><span className="text-slate-800 font-semibold">{selectedAppointment.email}</span></div>

                {selectedAppointment.rejectionReason && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-lg mt-2">
                    <p className="font-semibold">Red Nedeni:</p>
                    <p className="mt-0.5">{selectedAppointment.rejectionReason}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                {selectedAppointment.status !== "onaylandi" && (
                  <button
                    disabled={isSendingMail}
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "onaylandi")}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    {isSendingMail && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Talebi Onayla & Mail Gönder
                  </button>
                )}
                {selectedAppointment.status !== "reddedildi" && (
                  <button
                    disabled={isSendingMail}
                    onClick={() => {
                      setTargetRejectId(selectedAppointment.id);
                      setRejectReason("");
                      setRejectModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Talebi Reddet & Mail Gönder
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RED GEREKÇESİ MODALI */}
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-2">Randevu Reddi & E-Posta Bildirimi</h3>
              <p className="text-xs text-slate-500 mb-3">
                Öğretmene gönderilecek e-postada yer alacak red gerekçesini yazınız:
              </p>
              <textarea
                rows={3}
                placeholder="Örn: Okulumuzda ilgili tarihte deneme sınavı olması sebebiyle ziyaret talebi uygun görülmemiştir."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white resize-none"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setRejectModalOpen(false)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer">
                  İptal
                </button>
                <button
                  disabled={isSendingMail}
                  onClick={() => {
                    if (targetRejectId) {
                      handleUpdateStatus(targetRejectId, "reddedildi", rejectReason || "Okul idaresi tarafından uygun görülmemiştir.");
                    }
                    setRejectModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  {isSendingMail && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Reddi Onayla ve Mail Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}