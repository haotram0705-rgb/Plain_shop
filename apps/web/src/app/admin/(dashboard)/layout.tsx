import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell"><AdminSidebar /><div className="admin-main"><AdminHeader /><main className="admin-content">{children}</main></div></div>;
}
