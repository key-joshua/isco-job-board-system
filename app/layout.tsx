import "./globals.css"
import type React from "react"
import type { Metadata } from "next"
import content from "@/contents.json"
import { Montserrat  } from "next/font/google";
import { Providers } from "@/libs/providers/providers";

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  icons: content?.web_site_icon_Url,
  title: content?.web_site_layout_title,
  description: content?.web_site_layout_description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon"href={content?.web_site_icon_Url} />
        <link rel="icon" type="image/png" href={content?.web_site_icon_Url} />
        <link rel="preload" as="image" href="/login-background.svg" type="image/svg+xml" />
        <link rel="preload" as="image" href="/landing-background.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${montserrat.className} w-full`}>
        <Providers> {children} </Providers>
      </body>
    </html>
  );
}
