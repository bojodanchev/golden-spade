import type { Metadata } from "next"
import { Montserrat, Open_Sans, Roboto_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Providers } from "@/components/providers"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
})

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Golden Spades - CRM & Event Management",
  description:
    "Premium CRM and event management platform for Golden Spades poker club",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${openSans.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
