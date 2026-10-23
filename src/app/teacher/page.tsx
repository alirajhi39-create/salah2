import TeacherDashboard from "@/components/TeacherDashboard";
import { acceptedPasswords } from "@/lib/auth";
import { getConfiguredPublicUrl } from "@/lib/deployment";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "لوحة المعلم | ورقة عمل إقام الصلاة",
  robots: { index: false, follow: false },
};

export default function TeacherPage() {
  const configuredPublicUrl = getConfiguredPublicUrl();
  const demoLoginEnabled = !configuredPublicUrl && acceptedPasswords().includes("1234");
  return <TeacherDashboard configuredPublicUrl={configuredPublicUrl} demoLoginEnabled={demoLoginEnabled} />;
}
