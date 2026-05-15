import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AcreetionOS News Tracker",
  description: "Tracking Linux distro news, open source developments, security updates, and infrastructure changes across the ecosystem.",
};

export const viewport: Viewport = {
  themeColor: "#2ecc71",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <div className="flex-1">
          {children}
        </div>
        
        <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <p className="mb-4">
              Part of the <a href="https://acreetionos.org" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium">AcreetionOS</a> project ecosystem.
            </p>
            <p className="text-xs">
              &copy; {new Date().getFullYear()} AcreetionOS Project. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
