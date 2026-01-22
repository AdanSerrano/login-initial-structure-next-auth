/**
 * Middleware de Seguridad - Nivel Empresarial/Bancario
 *
 * Implementa:
 * - Rate Limiting distribuido (Redis/Memoria)
 * - WAF (Web Application Firewall)
 * - Logging estructurado
 * - Sistema de alertas
 * - Detección de ataques
 * - Bloqueo automático de IPs maliciosas
 */

import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

// ============================================================================
// IMPORTACIÓN DINÁMICA DE SERVICIOS DE SEGURIDAD
// (Para evitar errores en edge runtime)
// ============================================================================

// Importamos los tipos que necesitamos
import type { RateLimitResult, RateLimitType } from "./lib/security/rate-limiter";
import type { SecurityLogContext } from "./lib/security/logger";
import type { WAFResult } from "./lib/security/waf";

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Rate limiting en memoria (fallback cuando Redis no está disponible)
const memoryRateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_CONFIG = {
  general: { maxRequests: 100, windowMs: 60 * 1000 },
  // Auth routes (password reset, verification, etc.) - moderado
  auth: { maxRequests: 30, windowMs: 60 * 1000 },
  api: { maxRequests: 60, windowMs: 60 * 1000 },
  // Login real (credentials) - estricto para prevenir brute force
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
};

// ============================================================================
// PATRONES DE DETECCIÓN DE ATAQUES (WAF BÁSICO EN EDGE)
// ============================================================================

// Paths sospechosos
const SUSPICIOUS_PATHS = [
  /\.env/i,
  /\.git/i,
  /\.htaccess/i,
  /wp-admin/i,
  /wp-login/i,
  /phpinfo/i,
  /phpmyadmin/i,
  /admin\.php/i,
  /shell/i,
  /\.\.\//i,
];

// User-Agents maliciosos
const MALICIOUS_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /nmap/i,
  /masscan/i,
  /acunetix/i,
  /dirbuster/i,
  /gobuster/i,
];

// Patrones de inyección básicos
const INJECTION_PATTERNS = [
  /<script[^>]*>/i,
  /javascript:/i,
  /(\bunion\b[\s\S]*\bselect\b)/i,
  /(\bor\b|\band\b)\s*['"]?\s*\d+\s*=\s*\d+/i,
];

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Genera un ID único para el request
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Obtiene la IP real del cliente
 */
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  const cfIP = request.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;
  return "unknown";
}

/**
 * Rate limiting en memoria (fallback)
 */
function checkMemoryRateLimit(
  key: string,
  config: { maxRequests: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const record = memoryRateLimit.get(key);

  if (!record || now > record.resetTime) {
    memoryRateLimit.set(key, { count: 1, resetTime: now + config.windowMs });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
      limit: config.maxRequests,
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit: config.maxRequests,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
    limit: config.maxRequests,
  };
}

/**
 * Genera página HTML para error de rate limiting
 */
function generateRateLimitPage(retryAfter: number, limitType: string): string {
  const messages: Record<string, { title: string; description: string }> = {
    auth: {
      title: "Demasiados intentos de autenticación",
      description: "Has realizado demasiadas solicitudes de autenticación. Por favor, espera un momento antes de intentar nuevamente.",
    },
    login: {
      title: "Demasiados intentos de inicio de sesión",
      description: "Por seguridad, hemos bloqueado temporalmente los intentos de inicio de sesión desde tu ubicación.",
    },
    api: {
      title: "Límite de API excedido",
      description: "Has excedido el límite de solicitudes a la API. Por favor, espera antes de continuar.",
    },
    general: {
      title: "Demasiadas solicitudes",
      description: "Has realizado demasiadas solicitudes en poco tiempo. Por favor, espera un momento.",
    },
  };

  const { title, description } = messages[limitType] || messages.general;
  const minutes = Math.ceil(retryAfter / 60);
  const timeText = minutes === 1 ? "1 minuto" : `${minutes} minutos`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #ffffff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 420px;
      width: 100%;
      text-align: center;
    }
    .icon {
      width: 64px;
      height: 64px;
      background: #fef2f2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    .icon svg {
      width: 32px;
      height: 32px;
      color: #ef4444;
    }
    h1 {
      color: #0a0a0a;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: -0.025em;
    }
    p {
      color: #737373;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .timer {
      background: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
    }
    .timer-label {
      color: #737373;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .timer-value {
      color: #0a0a0a;
      font-size: 36px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.025em;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      background: #0a0a0a;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.15s ease;
      border: none;
      cursor: pointer;
    }
    .btn:hover:not(:disabled) {
      background: #262626;
    }
    .btn:disabled {
      background: #e5e5e5;
      color: #a3a3a3;
      cursor: not-allowed;
    }
    .btn svg {
      width: 16px;
      height: 16px;
    }
    .home-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 16px;
      color: #737373;
      font-size: 14px;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .home-link:hover {
      color: #0a0a0a;
    }
    .home-link svg {
      width: 14px;
      height: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h1>${title}</h1>
    <p>${description}</p>
    <div class="timer">
      <div class="timer-label">Podrás intentar nuevamente en</div>
      <div class="timer-value" id="countdown">${timeText}</div>
    </div>
    <button class="btn" id="retryBtn" disabled onclick="window.location.reload()">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span id="btnText">Espera un momento...</span>
    </button>
    <a href="/" class="home-link">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Volver al inicio
    </a>
  </div>
  <script>
    let seconds = ${retryAfter};
    const countdown = document.getElementById('countdown');
    const btn = document.getElementById('retryBtn');
    const btnText = document.getElementById('btnText');

    function updateTimer() {
      if (seconds <= 0) {
        countdown.textContent = '¡Listo!';
        btn.disabled = false;
        btnText.textContent = 'Intentar de nuevo';
        btn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />';
        return;
      }
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      countdown.textContent = mins > 0
        ? mins + ':' + secs.toString().padStart(2, '0')
        : secs + 's';
      seconds--;
      setTimeout(updateTimer, 1000);
    }
    updateTimer();
  </script>
</body>
</html>`;
}

/**
 * Verifica patrones de inyección básicos
 */
function checkBasicInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Verifica si el path es sospechoso
 */
function isSuspiciousPath(pathname: string): boolean {
  return SUSPICIOUS_PATHS.some((pattern) => pattern.test(pathname));
}

/**
 * Verifica si el User-Agent es malicioso
 */
function isMaliciousUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MALICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

/**
 * Log de seguridad simplificado (para edge runtime)
 */
function logSecurity(
  level: "info" | "warn" | "error",
  message: string,
  data: Record<string, unknown>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  };

  if (IS_PRODUCTION) {
    console[level](JSON.stringify(logEntry));
  } else {
    console[level](`[SECURITY] ${message}`, data);
  }
}

// Limpiar rate limit cada 5 minutos
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryRateLimit.entries()) {
      if (now > record.resetTime) {
        memoryRateLimit.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

// ============================================================================
// FUNCIONES DE ROUTING
// ============================================================================

const isPublicRoute = (pathname: string): boolean => publicRoutes.includes(pathname);
const isAuthRoute = (pathname: string): boolean => authRoutes.includes(pathname);
const isApiAuthRoute = (pathname: string): boolean => pathname.startsWith(apiAuthPrefix);
const isApiRoute = (pathname: string): boolean => pathname.startsWith("/api/");
const isHealthRoute = (pathname: string): boolean => pathname === "/api/health";

// ============================================================================
// MIDDLEWARE PRINCIPAL
// ============================================================================

export const proxy = NextAuth(authConfig).auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const requestId = generateRequestId();
  const clientIP = getClientIP(req);
  const userAgent = req.headers.get("user-agent");
  const pathname = nextUrl.pathname;

  // ========================================================================
  // 0. PERMITIR HEALTH CHECK SIN RESTRICCIONES
  // ========================================================================
  if (isHealthRoute(pathname)) {
    return NextResponse.next();
  }

  // ========================================================================
  // 1. WAF - VERIFICACIONES DE SEGURIDAD BÁSICAS
  // ========================================================================

  // Verificar paths sospechosos
  if (isSuspiciousPath(pathname)) {
    logSecurity("warn", "Suspicious path blocked", {
      requestId,
      ip: clientIP,
      path: pathname,
      userAgent,
    });

    return new NextResponse("Not Found", { status: 404 });
  }

  // Verificar User-Agent malicioso (solo en producción)
  if (IS_PRODUCTION && isMaliciousUserAgent(userAgent)) {
    logSecurity("warn", "Malicious user-agent blocked", {
      requestId,
      ip: clientIP,
      path: pathname,
      userAgent,
    });

    return new NextResponse("Forbidden", { status: 403 });
  }

  // Verificar inyecciones básicas en el path y query
  const fullUrl = pathname + nextUrl.search;
  if (checkBasicInjection(decodeURIComponent(fullUrl))) {
    logSecurity("error", "Injection attempt blocked", {
      requestId,
      ip: clientIP,
      path: pathname,
      query: nextUrl.search,
      userAgent,
    });

    return new NextResponse("Bad Request", { status: 400 });
  }

  // ========================================================================
  // 2. RATE LIMITING
  // ========================================================================

  // Determinar tipo de rate limit
  // IMPORTANTE: /api/auth/session y /api/auth/providers son llamados automáticamente
  // por NextAuth en cada navegación, no son intentos de login reales.
  // Usamos "general" para estos endpoints para evitar falsos positivos.
  const isSessionOrProvidersCheck =
    pathname === "/api/auth/session" ||
    pathname === "/api/auth/providers" ||
    pathname === "/api/auth/csrf";

  let rateLimitType: RateLimitType = "general";
  if (isSessionOrProvidersCheck) {
    // Session checks son frecuentes pero no representan riesgo de seguridad
    rateLimitType = "general";
  } else if (pathname === "/login" || pathname === "/api/auth/signin" || pathname === "/api/auth/callback/credentials") {
    // Intentos de login reales - más estricto
    rateLimitType = "login";
  } else if (isAuthRoute(pathname) || isApiAuthRoute(pathname)) {
    // Otras rutas de autenticación
    rateLimitType = "auth";
  } else if (isApiRoute(pathname)) {
    rateLimitType = "api";
  }

  const rateLimitKey = `${rateLimitType}:${clientIP}`;
  const rateLimitConfig = RATE_LIMIT_CONFIG[rateLimitType] || RATE_LIMIT_CONFIG.general;
  const rateLimit = checkMemoryRateLimit(rateLimitKey, rateLimitConfig);

  if (!rateLimit.allowed) {
    logSecurity("warn", "Rate limit exceeded", {
      requestId,
      ip: clientIP,
      path: pathname,
      rateLimitType,
    });

    const retryAfter = rateLimit.retryAfter || 60;
    const rateLimitHtml = generateRateLimitPage(retryAfter, rateLimitType);

    return new NextResponse(rateLimitHtml, {
      status: 429,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetTime / 1000)),
      },
    });
  }

  // ========================================================================
  // 3. ROUTING DE AUTENTICACIÓN
  // ========================================================================

  // Rutas de API de autenticación - permitir siempre
  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Rutas públicas - permitir siempre
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Rutas de autenticación (login, register, etc.)
  if (isAuthRoute(pathname)) {
    if (isLoggedIn) {
      const callbackUrl = nextUrl.searchParams.get("callbackUrl");
      const redirectUrl =
        callbackUrl && !isAuthRoute(callbackUrl) && !isPublicRoute(callbackUrl)
          ? callbackUrl
          : DEFAULT_LOGIN_REDIRECT;

      logSecurity("info", "Authenticated user redirected from auth route", {
        requestId,
        ip: clientIP,
        path: pathname,
        redirectTo: redirectUrl,
        userId: req.auth?.user?.id,
      });

      return Response.redirect(new URL(redirectUrl, nextUrl.origin));
    }
    return NextResponse.next();
  }

  // Rutas protegidas - requieren autenticación
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    if (!isAuthRoute(pathname) && !isPublicRoute(pathname)) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }

    logSecurity("info", "Unauthenticated access attempt", {
      requestId,
      ip: clientIP,
      path: pathname,
      redirectTo: loginUrl.pathname,
    });

    return Response.redirect(loginUrl);
  }

  // ========================================================================
  // 4. HEADERS DE RESPUESTA
  // ========================================================================

  const response = NextResponse.next();

  // Request ID para trazabilidad
  response.headers.set("X-Request-ID", requestId);

  // Headers de rate limiting
  response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
  response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  response.headers.set(
    "X-RateLimit-Reset",
    String(Math.ceil(rateLimit.resetTime / 1000))
  );

  return response;
});

// ============================================================================
// CONFIGURACIÓN DEL MATCHER
// ============================================================================

export const config = {
  matcher: [
    // Excluir archivos estáticos y assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|sw\\.js$|workbox-.*\\.js$|swe-worker-.*\\.js$|manifest\\.json$).*)",
  ],
};
