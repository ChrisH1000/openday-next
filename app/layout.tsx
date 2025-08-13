import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingProvider } from "@/app/ui/LoadingContext";
import GlobalLoadingIndicator from "@/app/ui/GlobalLoadingIndicator";
import { ThemeProvider } from "@/app/ui/ThemeContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "OpenDay Admin",
  description: "Admin dashboard for managing OpenDay events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}
      >
        <ThemeProvider>
          <LoadingProvider>
            <GlobalLoadingIndicator />
            {children}
            <ToastContainer 
              position="top-right" 
              autoClose={3000} 
              theme="colored"
            />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
