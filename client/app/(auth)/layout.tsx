import type { Metadata } from "next";
import "../globals.css";
import { Poppins, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/store/ThemeProvider";
import Image from "next/image";
import { Codepen } from "lucide-react";
import ReactQueryProvider from "@/store/ReactQueryProvider";
import { AuthProvider } from "@/store/AuthProvider";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Inventory Management",
  description:
    "Inventory Management System for small businesses and startups to manage their inventory. Built with Next.js, Node.js, and MongoDb. Deployed on AWS. Open source on GitHub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} ${roboto.variable} flex bg-bg dark:bg-darkBg `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <AuthProvider>
              <Toaster richColors position="top-right" />
              <main className="grid md:grid-cols-2 h-screen w-screen">
                <div className="bg-gray-200 max-md:hidden min-h-screen">
                  <Image
                    src="/images/auth-image.jpg"
                    alt="Full size image"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="flex items-center justify-center relative bg-bg dark:bg-darkBg w-full h-full ">
                  <div className="absolute md:top-10 md:right-10 top-5 right-5">
                    <Codepen className="size-10 text-text dark:text-darkText" />
                  </div>
                  {children}
                </div>
              </main>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
