//#layout.tsx
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"
import { Inter as FontSans } from "next/font/google"
import Link from "next/link"
import { GithubIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainContentWrapper } from "@/components/main-content-wrapper"
import { SplashCursor } from "@/components/ui/splash-cursor"

const geistSans = GeistSans
const geistMono = GeistMono
const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Jacob Christensen - Portfolio",
  description: "Personal portfolio of Jacob Christensen - AI, Data Engineering, and Software Development",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SplashCursor />
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 main-content">
              <header className="sticky top-0 z-40 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center">
                  <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href="https://github.com/neuraldevx" target="_blank" rel="noopener noreferrer">
                          <GithubIcon className="h-[1.2rem] w-[1.2rem]" />
                          <span className="sr-only">GitHub</span>
                        </Link>
                      </Button>
                      <ModeToggle />
                      <Button asChild variant="outline" size="sm">
                        <Link href="/contact">Get in Touch</Link>
                      </Button>
                    </nav>
                  </div>
                </div>
              </header>
              <MainContentWrapper>
                {children}
              </MainContentWrapper>
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
