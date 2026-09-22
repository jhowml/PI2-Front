import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/shared/components/query-provider";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Soberania Digital",
  description: "Gestão interna de pedidos, cardápio e clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} h-full antialiased`}>
      <body className="bg-background flex min-h-full flex-col font-sans">
        <QueryProvider>
          {children}
          <Toaster richColors position="bottom-left" />
        </QueryProvider>
      </body>
    </html>
  );
}
