import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Shell } from "@/components/Shell";
import { ToastProvider } from "@/components/ui/Toast";
import { site } from "@/config/site";
import { AnalyticsContextProvider } from "@/modules/analytics/analytics-context";
import { StorageContextProvider } from "@/modules/storage/storage-context";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const description =
  "Bichu: descubra o animal secreto a cada chute. Pistas sobre classe, dieta, habitat, peso e mais. Jogue o Animal do Dia ou no Modo Infinito.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — adivinhe o animal do dia`,
    template: `%s — ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    site.name.toLowerCase(),
    "animal do dia",
    "adivinhe o animal",
    "termo",
    "wordle",
    "jogo de palavras",
    "jogo online",
  ],
  category: "games",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  // Preview de link minimizado nos cards sociais: sem imagem e sem descrição.
  // Sobram só título + URL. A `description` de topo fica por SEO (Google).
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — adivinhe o animal do dia`,
  },
  twitter: {
    card: "summary",
    title: `${site.name} — adivinhe o animal do dia`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7aa6a1",
  maximumScale: 5,
};

// Dados estruturados (schema.org) ajudam os buscadores a entender o site.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description,
  inLanguage: "pt-BR",
  publisher: { "@type": "Organization", name: site.name, url: site.url },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {site.gaId.length > 0 && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`}
              strategy="afterInteractive"
            />
            <Script id={`${site.name.toLowerCase().replace(/\s+/g, "-")}-ga-init`} strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.gaId}');`}
            </Script>
          </>
        )}
        <StorageContextProvider>
          <AnalyticsContextProvider>
            <ToastProvider>
              <Shell>{children}</Shell>
            </ToastProvider>
          </AnalyticsContextProvider>
        </StorageContextProvider>
      </body>
    </html>
  );
}
