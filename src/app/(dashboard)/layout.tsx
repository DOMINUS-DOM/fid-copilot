import { Sidebar, MobileHeader } from "@/components/layout/sidebar";
import { WelcomeBetaModal } from "@/components/feedback/welcome-beta-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col lg:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
      <WelcomeBetaModal />
    </div>
  );
}
