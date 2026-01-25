import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { CookieConsentWrapper } from "@/components/cookie-consent/cookie-consent-wrapper";
import { SessionGuard } from "@/components/auth/session-guard";
import { ThemeProvider } from "@/components/theme-provider";
import { RootJsonLd } from "@/lib/seo/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Nexus";
const APP_DESCRIPTION =
  "Sistema de autenticación completo y seguro con verificación de email, autenticación de dos factores (2FA), recuperación de contraseña y arquitectura modular. Production-ready con Next.js 16, React 19 y TypeScript.";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Sistema de Autenticación`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [
    {
      name: "Adan Serrano",
      url: "https://github.com/AdanSerrano",
    },
  ],
  generator: "Next.js",
  keywords: [
    "autenticación",
    "authentication",
    "login",
    "registro",
    "2FA",
    "two-factor",
    "verificación email",
    "Next.js",
    "React",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
    "Auth.js",
    "NextAuth",
    "boilerplate",
    "seguridad",
    "JWT",
    "sesiones",
  ],
  creator: "Adan Serrano",
  publisher: APP_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "technology",
  classification: "Authentication System",

  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Sistema de Autenticación Seguro`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Sistema de Autenticación`,
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Sistema de Autenticación`,
    description: APP_DESCRIPTION,
    images: ["/icon.png"],
    creator: "@adanserrano",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: APP_URL,
    languages: {
      "es-ES": APP_URL,
      "en-US": `${APP_URL}/en`,
    },
  },

  verification: {
    // Agregar cuando tengas los códigos de verificación
    // google: "tu-codigo-de-verificacion-google",
    // yandex: "tu-codigo-de-verificacion-yandex",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },

  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nexus" />
        <meta name="mobile-web-app-capable" content="yes" />
        <RootJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <SessionGuard>
              {children}
            </SessionGuard>
            <CookieConsentWrapper />
          </SessionProvider>
          <Toaster position="bottom-right" richColors closeButton={true} duration={3000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
