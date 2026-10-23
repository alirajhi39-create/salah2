import StudentSharing from "@/components/StudentSharing";
import { getConfiguredPublicUrl } from "@/lib/deployment";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "إتاحة ورقة العمل للطلاب | خطوات النشر العام",
  robots: { index: false, follow: false },
};

const steps = [
  {
    title: "تنزيل المشروع ورفعه إلى GitHub",
    description: "نزّل النسخة المرفقة أدناه، فك ضغطها، ثم ارفع ملفاتها إلى مستودع GitHub خاص. لا ترفع ملفات .env أو كلمات المرور أو بيانات الطلاب. النسخة المرفقة تستبعد هذه الملفات.",
  },
  {
    title: "إنشاء نشر عام في Render",
    description: "افتح حساب الاستضافة واختر New ثم Blueprint، واربط مستودع المشروع. سيقرأ Render ملف render.yaml المرفق لإنشاء Web Service وقاعدة PostgreSQL. لا تختَر Static Site؛ إرسال الإجابات يحتاج خادمًا وقاعدة بيانات.",
  },
  {
    title: "تعيين كلمة مرور المعلم ومراجعة التكلفة",
    description: "أدخل كلمة مرور خاصة في TEACHER_PASSWORD. يربط الإعداد قاعدة البيانات تلقائيًا ويولّد AUTH_SECRET. ملف النشر يختار خططًا مدفوعة لتجنب انتهاء قاعدة البيانات التجريبية؛ راجع أسعار الاستضافة ووافق عليها فقط إن ناسبتك. إنشاء الملف هنا لا ينشر الموقع ولا ينشئ أي اشتراك.",
  },
  {
    title: "انتظار اكتمال النشر",
    description: "بعد أن يعرض Render حالة Live، افتح عنوان HTTPS الذي أعطاك إياه. يستخدم التطبيق عنوان Render تلقائيًا. إذا ربطت نطاقًا خاصًا، عيّن APP_PUBLIC_URL إلى عنوان ذلك الموقع وأعد النشر.",
  },
  {
    title: "اختبار الوصول قبل مشاركة الرابط",
    description: "افتح رابط /student في نافذة خاصة على الجوال، دون الدخول إلى Arena. أرسل إجابة تجريبية، ثم افتح /teacher على الموقع المنشور نفسه وتأكد من وصولها. بعد نجاح الاختبار انسخ رابط الطلاب أو رمز QR من لوحة المعلم الجديدة.",
  },
];

export default function PublishPage() {
  return (
    <main className="islamic-bg min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <a href="/teacher" className="mb-5 inline-block text-sm font-bold text-teal-dark">→ العودة إلى لوحة المعلم</a>
        <header className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="bg-teal-brand p-6 text-white sm:p-8">
            <p className="text-sm font-bold text-teal-soft">دليل المعلم</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">كيف أرسل الورقة للطلاب خارج Arena؟</h1>
            <p className="mt-3 leading-7 text-teal-soft">رابط الطلاب يعمل دون حساب في التطبيق، لكن الموقع يجب أن يكون منشورًا للعامة أولًا.</p>
          </div>
          <div className="p-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <h2 className="font-extrabold">لماذا تظهر رسالة Preview Unavailable؟</h2>
              <p className="mt-2 text-sm leading-7">هذه رسالة من خدمة معاينة Arena، وليست من ورقة العمل. رابط المعاينة مقيّد بالمنصة؛ لا يمكن تحويله إلى رابط عام بتغيير المسار إلى /student أو بإعادة تحميل الصفحة أو بإنشاء رمز QR. لا يحتاج الطالب إلى إنشاء حساب Arena؛ الحل هو نشر الموقع على استضافة عامة.</p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href="/downloads/worksheet-project.zip" download className="rounded-full bg-teal-brand px-6 py-3 font-bold text-white hover:bg-teal-dark">↓ تنزيل المشروع الجاهز للنشر</a>
              <a href="https://dashboard.render.com/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-teal-brand/30 px-6 py-3 font-bold text-teal-dark">فتح Render ↗</a>
            </div>
            <p className="mt-3 text-xs leading-6 text-slate-500">الملف يحتوي الكود وإعدادات النشر فقط، وليس الإجابات أو كلمات المرور. يلزم حساب استضافة وربط المشروع؛ لم يُنشأ رابط عام تلقائيًا هنا.</p>
          </div>
        </header>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow sm:p-8" aria-labelledby="publish-steps">
          <h2 id="publish-steps" className="text-xl font-extrabold text-teal-dark">الطريقة المقترحة: Render مع PostgreSQL</h2>
          <ol className="mt-6 space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-soft font-extrabold text-teal-dark">{(index + 1).toLocaleString("ar-EG")}</span>
                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl bg-cream p-4 text-sm leading-7 text-brown-dark">
            <p className="font-bold">مهم لحفظ إجابات الطلاب</p>
            <p>الموقع المنشور يستخدم قاعدة بياناته الدائمة. إجابات المعاينة لا تنتقل إليه تلقائيًا. صدّر النتائج الحالية من لوحة المعلم قبل الانتقال، ولا تحذف قاعدة البيانات بعد بدء استخدام الطلاب.</p>
          </div>
          <a href="https://render.com/docs/deploy-nextjs-app" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-bold text-teal-dark underline">دليل Render الرسمي لنشر Next.js ↗</a>
        </section>

        <StudentSharing configuredPublicUrl={getConfiguredPublicUrl()} />
      </div>
    </main>
  );
}
