import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminProtected from "@/components/admin/AdminProtected";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProtected>
      <div className="flex h-screen bg-slate-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminProtected>
  );
}
