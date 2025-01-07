import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from "@/components/theme-provider"
import { SiteSidebar } from "@/components/site-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import "./globals.css"

// These are already font instances, no need to initialize them
const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: 'Jacob Christensen - Portfolio',
  description: 'Personal portfolio of Jacob Christensen - AI, Data Engineering, and Software Development',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-black text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen>
            <SiteSidebar />
            <SidebarInset>
              <header className="flex h-16 items-center gap-4 border-b bg-black/50 px-6 backdrop-blur-sm">
                <SidebarTrigger />
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
