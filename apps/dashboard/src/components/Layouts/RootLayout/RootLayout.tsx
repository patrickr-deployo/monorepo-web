import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { Providers } from "@/app/providers"

import "@/app/globals.css"

// Inter font. May be removed if not used.
const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-inter",
})

const sfPro = localFont({
  src: "./fonts/SF-Pro.ttf",
  variable: "--font-sf-pro",
})

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sfPro.className}`}>
      <link href="./logo.svg" rel="icon" sizes="any" />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
