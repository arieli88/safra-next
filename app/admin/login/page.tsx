import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Header } from "@/components/site/header";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAdminPageData } from "@/lib/site-content-data";

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();
  const { viewContent } = await getAdminPageData();

  if (authenticated) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen">
      <Header nav={viewContent.nav} logoUrl={viewContent.meta.logoUrl} />
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">Admin</p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-foreground">ניהול בית מדרש ספרא</h1>
            <p className="mt-4 text-base leading-8 text-muted">
              התחברו כדי לערוך טקסטים, עדכוני ticker, תמונות וקרוסלות בזמן אמת.
            </p>
            <div className="mt-8">
              <AdminLoginForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
