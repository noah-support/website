import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-dvh">
      <AdminNav />
      {children}
    </div>
  );
}
