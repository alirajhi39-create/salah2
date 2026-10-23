"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { resolveStudentShareTarget, type StudentShareTarget } from "@/lib/sharing";

export default function StudentSharing({ configuredPublicUrl = "" }: { configuredPublicUrl?: string }) {
  const [target, setTarget] = useState<StudentShareTarget>(() => resolveStudentShareTarget(configuredPublicUrl));
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // The host is checked after mount to avoid hydration differences.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTarget(resolveStudentShareTarget(configuredPublicUrl, window.location.origin));
  }, [configuredPublicUrl]);

  async function copyLink() {
    if (!target.url) return;
    setError("");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(target.url);
      setCopied(true);
    } catch {
      inputRef.current?.focus();
      inputRef.current?.select();
      if (document.execCommand("copy")) setCopied(true);
      else setError("تعذر النسخ التلقائي. اضغط مطولًا على الرابط ثم اختر نسخ.");
    }
  }

  const whatsappMessage = target.url
    ? "📝 ورقة عمل: إقام الصلاة — الصف الثالث\nافتح الرابط، اكتب اسمك وفصلك، ثم حل الأسئلة واضغط إرسال للمعلم. لا تحتاج إلى حساب.\n" + target.url
    : "";

  return (
    <section id="student-sharing" aria-labelledby="sharing-title" className="mt-6 scroll-mt-4 overflow-hidden rounded-2xl border-2 border-teal-brand/20 bg-white shadow">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
        <h2 id="sharing-title" className="text-lg font-extrabold text-teal-dark">🔗 رابط الطلاب ومشاركة الورقة</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${target.url ? "bg-teal-soft text-teal-dark" : "bg-amber-100 text-amber-800"}`}>
          {target.url ? "عنوان موقع منشور" : target.status === "pending" ? "جارٍ التحقق من العنوان…" : "المشاركة تحتاج نشرًا عامًا"}
        </span>
      </div>

      <div className="p-5">
        {target.url ? (
          <>
            <p className="text-sm leading-relaxed text-slate-600">الطالب يكتب اسمه وفصله، يحل الورقة، ثم يرسل للمعلم. لا يحتاج إلى حساب في التطبيق.</p>
            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-bold text-teal-dark">الرابط المخصص للطلاب</span>
              <input ref={inputRef} aria-label="رابط الطلاب" readOnly dir="ltr" value={target.url} className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm" onClick={(event) => event.currentTarget.select()} />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={copyLink} className="rounded-full bg-teal-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-dark">{copied ? "✓ تم نسخ الرابط" : "نسخ رابط الطلاب"}</button>
              <a href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">مشاركة عبر واتساب</a>
              <button type="button" onClick={() => setShowQr((v) => !v)} aria-expanded={showQr} className="rounded-full border border-teal-brand/30 px-5 py-2.5 text-sm font-bold text-teal-dark">{showQr ? "إخفاء رمز QR" : "عرض رمز QR"}</button>
              <a href={target.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600">فتح الرابط ↗</a>
            </div>
            {showQr && <div className="mx-auto mt-5 w-fit rounded-2xl border border-slate-200 bg-white p-4"><QRCode value={target.url} size={168} title="رابط ورقة العمل للطلاب" /></div>}
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-800">قبل الإرسال: افتح الرابط في نافذة خاصة دون حساب Arena وجرّب إرسال إجابة. وجود عنوان هنا ليس اختبارًا لوصول الطلاب إليه. تظهر الإجابات في لوحة المعلم على الموقع المنشور نفسه.</p>
          </>
        ) : target.status === "pending" ? (
          <p className="py-3 text-sm text-slate-500">جارٍ التحقق من عنوان الموقع…</p>
        ) : (
          <div role="status">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-extrabold text-amber-900">⚠️ {target.status === "invalid" ? "عنوان النشر العام غير صالح" : "هذه معاينة وليست رابطًا عامًا للطلاب"}</h3>
              <p className="mt-2 text-sm leading-7 text-amber-900">رابط المعاينة مقيّد بمنصة Arena. عند فتحه خارجها قد تظهر رسالة <span dir="ltr" className="font-bold">Preview Unavailable</span>. تغيير كلمة المرور أو تحويله إلى QR لن يزيل هذا القيد.</p>
              <p className="mt-2 text-sm font-bold leading-7 text-amber-900">أوقفنا نسخ رابط المعاينة ومشاركته. يلزم نشر التطبيق وقاعدة بياناته على استضافة عامة أولًا.</p>
            </div>
            <a href="/teacher/publish" className="mt-4 inline-block rounded-full bg-teal-brand px-6 py-3 text-sm font-bold text-white hover:bg-teal-dark">خطوات الحصول على رابط عام ←</a>
            <p className="mt-3 text-xs leading-6 text-slate-500">إعدادات النشر مرفقة بالمشروع. لم يتم إنشاء موقع عام من داخل هذه المعاينة.</p>
          </div>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      </div>
    </section>
  );
}
