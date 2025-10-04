import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { CompanySelector } from "@/components/company-selector";
import { Toaster } from "@/components/ui/sonner";
import { getSelectedCompanyId } from "@/lib/company-context";
import { SearchProvider } from "@/components/search-provider";
import { HeaderSearch } from "@/components/header-search";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MailSplit - Email Management Dashboard",
  description: "Manage and route customer emails to the right teams",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const selectedCompanyId = await getSelectedCompanyId();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-auto">
            <SearchProvider companyId={selectedCompanyId}>
              <header className="border-b bg-background sticky top-0 z-10">
                <div className="container max-w-5xl h-14 flex items-center justify-end px-6 relative">
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <HeaderSearch />
                  </div>
                  <CompanySelector initialCompanyId={selectedCompanyId} />
                </div>
              </header>
              <main className="flex-1">
                <div className="container max-w-5xl py-8">
                  {children}
                </div>
              </main>
            </SearchProvider>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
