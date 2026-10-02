import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LENTERA — Layanan Eksplorasi Penelitian, Teknologi & Pengabdian",
    template: "%s | LENTERA",
  },
  description:
    "Etalase hasil penelitian dan pengabdian kepada masyarakat Universitas Widyatama.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
