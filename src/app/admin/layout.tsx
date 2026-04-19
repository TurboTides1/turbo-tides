import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page gets its own layout (no sidebar)
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      <AdminSidebar userName={session.user.name ?? "Admin"} />
      <div className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
