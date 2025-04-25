import type { Metadata } from "next";
import "../globals.css";
import { Header, Sidebar } from "@/components/shared";
import { Poppins, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/store/ThemeProvider";
import { AuthProvider } from "@/store/AuthProvider";
import ReactQueryProvider from "@/store/ReactQueryProvider";

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
    <html lang="en">
      <body
        className={`${poppins.className} ${roboto.variable} flex bg-bg dark:bg-darkBg `}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors position="top-right" />
              <aside className="lg:w-full min-w-[60px] w-fit lg:max-w-[300px] sticky top-0 h-screen overflow-y-auto border border-r dark:border-neutral-800">
                <Sidebar />
              </aside>
              <main className="w-full overflow-x-hidden">
                <Header />
                {children}
              </main>
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
