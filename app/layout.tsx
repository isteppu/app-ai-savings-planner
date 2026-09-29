import type { Metadata } from "next";
import "./globals.css";
import { FinanceProvider } from "../lib/context/FinanceContext";

export const metadata: Metadata = {
  title: "AI Budget Planner",
  description: "Plan your savings and see if you can afford your goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FinanceProvider>
          {children}
        </FinanceProvider>
      </body>
    </html>
  );
}
