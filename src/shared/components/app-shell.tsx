import { AppSidebar } from "./app-sidebar";
import { BottomNav } from "./bottom-nav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-1">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-sidebar-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-sidebar-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <AppSidebar />
      <main id="conteudo" tabIndex={-1} className="min-h-0 min-w-0 flex-1 overflow-auto bg-background pb-16 focus:outline-none md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
