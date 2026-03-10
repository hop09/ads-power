import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ads Dashboard",
  description: "Manage your ad pages and ad codes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
