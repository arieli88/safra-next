import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Header } from "@/components/site/header";
import { requireAdminAuth } from "@/lib/auth";
import { getSiteContent } from "@/lib/site-content-store";
import { withStaticSiteCopy } from "@/lib/static-site-copy";

export default async function AdminPage() {
  await requireAdminAuth();
  const content = await getSiteContent();
  const viewContent = withStaticSiteCopy(content);

  return (
    <div className="min-h-screen">
      <Header nav={viewContent.nav} logoUrl={viewContent.meta.logoUrl} />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AdminDashboard initialContent={content} />
        </div>
      </main>
    </div>
  );
}
