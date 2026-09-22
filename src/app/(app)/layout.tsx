import { AppShell } from "@/shared";
import { AuthGuard } from "@/shared/components/auth-guard";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
