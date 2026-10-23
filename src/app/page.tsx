import Worksheet from "@/components/Worksheet";

export default function Home() {
  return (
    <>
      <a
        href="/teacher"
        className="no-print fixed left-4 top-4 z-30 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-teal-dark shadow hover:bg-white md:left-8"
      >
        👩‍🏫 لوحة المعلم
      </a>
      <div className="islamic-bg border-b border-teal-brand/20 bg-white/80 px-4 py-2 text-center text-sm font-bold text-teal-dark backdrop-blur">
        📝 ورقة عمل للطلاب — اكتب اسمك وابدأ الحل ثم أرسل للمعلم، دون إنشاء حساب.
      </div>
      <Worksheet />
    </>
  );
}
