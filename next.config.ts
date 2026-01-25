import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

// ============================================================================
// CONFIGURACIÓN PWA - Progressive Web App
// ============================================================================
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    // Excluir rutas sensibles del cache
    navigateFallbackDenylist: [/^\/api\//, /^\/dashboard\/admin\//],
    // Limitar tamaño de cache
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
    runtimeCaching: [
      {
        // Cache de assets estáticos
        urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
          },
        },
      },
      {
        // Cache de imágenes
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-images",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
          },
        },
      },
      {
        // NO cachear API calls - seguridad bancaria
        urlPattern: /^https?:\/\/.*\/api\/.*/i,
        handler: "NetworkOnly",
      },
    ],
  },
});

// ============================================================================
// HEADERS DE SEGURIDAD - Nivel Empresarial/Bancario
// ============================================================================
const securityHeaders = [
  // Prevenir clickjacking - No permitir que la app se muestre en iframes
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevenir MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Habilitar protección XSS del navegador
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // DNS Prefetch Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Strict Transport Security - Forzar HTTPS por 2 años
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Referrer Policy - No enviar referrer a otros dominios
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Permissions Policy - Restringir APIs del navegador
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "browsing-topics=()",
      "interest-cohort=()",
      "payment=(self)",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
    ].join(", "),
  },
  // Content Security Policy - Política de contenido estricta
  {
    key: "Content-Security-Policy",
    value: [
      // Solo permitir contenido del mismo origen
      "default-src 'self'",
      // Scripts: mismo origen + inline necesarios para Next.js
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Estilos: mismo origen + inline para Tailwind
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Imágenes: mismo origen + data URIs + blobs
      "img-src 'self' data: blob: https:",
      // Fuentes: Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Conexiones: mismo origen + APIs necesarias + Cloudflare R2
      `connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://*.r2.cloudflarestorage.com ${process.env.R2_PUBLIC_URL || ""}`.trim(),
      // Frames: ninguno permitido
      "frame-src 'none'",
      // Frame ancestors: ninguno (prevenir embedding)
      "frame-ancestors 'none'",
      // Base URI: mismo origen
      "base-uri 'self'",
      // Form actions: mismo origen
      "form-action 'self'",
      // Object sources: ninguno
      "object-src 'none'",
      // Manifest: mismo origen
      "manifest-src 'self'",
      // Worker sources: mismo origen
      "worker-src 'self'",
      // Upgrade insecure requests en producción
      process.env.NODE_ENV === "production" ? "upgrade-insecure-requests" : "",
      // Block mixed content
      "block-all-mixed-content",
    ]
      .filter(Boolean)
      .join("; "),
  },
  // Cross-Origin Embedder Policy
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "credentialless",
  },
  // Cross-Origin Opener Policy
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  // Cross-Origin Resource Policy
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  // No almacenar en cache datos sensibles
  {
    key: "Cache-Control",
    value: "no-store, no-cache, must-revalidate, proxy-revalidate",
  },
  {
    key: "Pragma",
    value: "no-cache",
  },
  {
    key: "Expires",
    value: "0",
  },
];

// Headers específicos para assets estáticos (permitir cache)
const staticAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

// ============================================================================
// CONFIGURACIÓN PRINCIPAL DE NEXT.JS
// ============================================================================
const nextConfig: NextConfig = {
  // Turbopack config (para desarrollo)
  turbopack: {},

  // ========================================================================
  // SEGURIDAD BÁSICA
  // ========================================================================

  // Ocultar header X-Powered-By
  poweredByHeader: false,

  // Trailing slashes consistentes
  trailingSlash: false,

  // Strict mode de React
  reactStrictMode: true,

  // ========================================================================
  // OPTIMIZACIÓN DE COMPILACIÓN
  // ========================================================================

  // Optimización de paquetes
  experimental: {
    // Optimizar imports de paquetes grandes
    optimizePackageImports: [
      // Iconos
      "lucide-react",
      "@radix-ui/react-icons",
      // Utilidades
      "date-fns",
      "lodash",
      "lodash-es",
      // Charts (muy pesado)
      "recharts",
      // Animaciones
      "motion",
      "motion/react",
      "framer-motion",
      // UI Components
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      // Forms
      "react-hook-form",
      "@hookform/resolvers",
      // Otros
      "sonner",
      "cmdk",
      "vaul",
      "embla-carousel-react",
      "input-otp",
      "react-day-picker",
      "react-resizable-panels",
      "zod",
    ],
  },

  // ========================================================================
  // CONFIGURACIÓN DE IMÁGENES
  // ========================================================================
  images: {
    // Formatos modernos
    formats: ["image/avif", "image/webp"],
    // Dominios permitidos (agregar los necesarios)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Cloudflare R2 storage
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
    // Tamaños de dispositivo
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Tamaños de imagen
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimizar tamaño
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    // Deshabilitar importación de imágenes de dominios no listados
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ========================================================================
  // HEADERS DE SEGURIDAD
  // ========================================================================
  async headers() {
    return [
      // Headers de seguridad para todas las rutas
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Headers específicos para API routes
      {
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          // Deshabilitar cache completamente para APIs
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
          // CORS restrictivo
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-CSRF-Token",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
      // Headers para assets estáticos
      {
        source: "/static/:path*",
        headers: staticAssetHeaders,
      },
      {
        source: "/_next/static/:path*",
        headers: staticAssetHeaders,
      },
      // Headers para manifest y service worker
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // 1 día
          },
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "application/javascript",
          },
        ],
      },
    ];
  },

  // ========================================================================
  // REDIRECTS DE SEGURIDAD
  // ========================================================================
  async redirects() {
    return [
      // Forzar HTTPS en producción
      ...(process.env.NODE_ENV === "production"
        ? [
            {
              source: "/:path*",
              has: [
                {
                  type: "header" as const,
                  key: "x-forwarded-proto",
                  value: "http",
                },
              ],
              destination: "https://${process.env.NEXT_PUBLIC_APP_URL}/:path*",
              permanent: true,
            },
          ]
        : []),
    ];
  },

  // ========================================================================
  // REWRITES
  // ========================================================================
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // ========================================================================
  // LOGGING EN PRODUCCIÓN
  // ========================================================================
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },

  // ========================================================================
  // CONFIGURACIÓN DE WEBPACK ADICIONAL
  // ========================================================================
  webpack: (config, { isServer }) => {
    // Ignorar warnings de módulos opcionales
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Source maps solo en desarrollo
    if (process.env.NODE_ENV === "production") {
      config.devtool = false;
    }

    return config;
  },

  // ========================================================================
  // VARIABLES DE ENTORNO PÚBLICAS PERMITIDAS
  // ========================================================================
  env: {
    // Solo exponer variables necesarias al cliente
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Nexus",
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(withPWA(nextConfig));
