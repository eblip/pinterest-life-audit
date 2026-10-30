import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pinterest Life Audit",
  description:
    "Transformez un tableau Pinterest public en audit de vie et en plan d'action concret.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
