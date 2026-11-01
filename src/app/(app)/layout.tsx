import { AppShell } from "@/shared";
import { AuthGuard } from "@/shared/components/auth-guard";
import { KeyboardShortcutsProvider } from "@/shared/keyboard-shortcuts";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <KeyboardShortcutsProvider>
        <AppShell>{children}</AppShell>
      </KeyboardShortcutsProvider>
    </AuthGuard>
  );
}
