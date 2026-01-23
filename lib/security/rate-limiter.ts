/**
 * Rate Limiter en Memoria
 *
 * Implementa rate limiting con:
 * - Almacenamiento en memoria
 * - Algoritmo de ventana fija para simplicidad y rendimiento
 * - Soporte para múltiples tipos de límites
 */

// ============================================================================
// TIPOS
// ============================================================================

export interface RateLimitConfig {
  /** Máximo de requests permitidos */
  maxRequests: number;
  /** Ventana de tiempo en milisegundos */
  windowMs: number;
  /** Mensaje de error personalizado */
  message?: string;
  /** Headers adicionales a incluir */
  includeHeaders?: boolean;
}

export interface RateLimitResult {
  /** Si el request está permitido */
  allowed: boolean;
  /** Requests restantes en la ventana */
  remaining: number;
  /** Timestamp de reset (Unix ms) */
  resetTime: number;
  /** Total de requests permitidos */
  limit: number;
  /** Tiempo de espera en segundos si fue bloqueado */
  retryAfter?: number;
}

export type RateLimitType =
  | "general"
  | "auth"
  | "api"
  | "login"
  | "register"
  | "password-reset"
  | "verification"
  | "admin";

// ============================================================================
// CONFIGURACIÓN DE LÍMITES
// ============================================================================

export const RATE_LIMIT_CONFIGS: Record<RateLimitType, RateLimitConfig> = {
  // Límite general para todas las rutas
  general: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minuto
    message: "Demasiadas solicitudes. Por favor, espera un momento.",
  },

  // Rutas de autenticación (moderado - password reset, verification, etc.)
  auth: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minuto
    message: "Demasiados intentos de autenticación. Espera antes de reintentar.",
  },

  // API general
  api: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minuto
    message: "Límite de API excedido. Intenta más tarde.",
  },

  // Login específico (muy estricto)
  login: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: "Demasiados intentos de inicio de sesión. Cuenta temporalmente bloqueada.",
  },

  // Registro (estricto)
  register: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    message: "Demasiados intentos de registro desde esta IP.",
  },

  // Reset de contraseña (muy estricto)
  "password-reset": {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    message: "Demasiadas solicitudes de recuperación de contraseña.",
  },

  // Verificación de email
  verification: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hora
    message: "Demasiadas solicitudes de verificación.",
  },

  // Rutas de admin (moderado pero monitoreado)
  admin: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minuto
    message: "Límite de administración excedido.",
  },
};

// ============================================================================
// STORAGE EN MEMORIA
// ============================================================================

interface MemoryRecord {
  count: number;
  resetTime: number;
  timestamps: number[]; // Para ventana deslizante
}

const memoryStore = new Map<string, MemoryRecord>();

// Limpiar registros antiguos cada 5 minutos
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (now > record.resetTime) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

// ============================================================================
// RATE LIMITER EN MEMORIA
// ============================================================================

/**
 * Rate limiting en memoria con ventana fija
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const record = memoryStore.get(key);

  // Si no hay registro o la ventana expiró, crear nuevo
  if (!record || now > record.resetTime) {
    const newRecord: MemoryRecord = {
      count: 1,
      resetTime: now + config.windowMs,
      timestamps: [now],
    };
    memoryStore.set(key, newRecord);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newRecord.resetTime,
      limit: config.maxRequests,
    };
  }

  // Verificar si se excedió el límite
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit: config.maxRequests,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  // Incrementar contador
  record.count++;
  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
    limit: config.maxRequests,
  };
}

// ============================================================================
// API PÚBLICA
// ============================================================================

/**
 * Verifica el rate limit para un identificador
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType = "general"
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIGS[type];
  const key = `${type}:${identifier}`;

  return checkRateLimitMemory(key, config);
}

/**
 * Resetea el rate limit para un identificador
 */
export async function resetRateLimit(
  identifier: string,
  type: RateLimitType = "general"
): Promise<boolean> {
  const key = `${type}:${identifier}`;

  // Limpiar en memoria
  memoryStore.delete(`ratelimit:${key}`);

  return true;
}

/**
 * Obtiene los headers de rate limit para una respuesta
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
  };

  if (!result.allowed && result.retryAfter) {
    headers["Retry-After"] = String(result.retryAfter);
  }

  return headers;
}

/**
 * Crea un rate limiter personalizado
 */
export function createRateLimiter(config: RateLimitConfig) {
  return {
    check: (identifier: string) => {
      const key = `custom:${identifier}`;
      return Promise.resolve(checkRateLimitMemory(key, config));
    },
    reset: async (identifier: string) => {
      const key = `ratelimit:custom:${identifier}`;
      memoryStore.delete(key);
      return true;
    },
  };
}

// ============================================================================
// RATE LIMITER PARA IPS BLOQUEADAS
// ============================================================================

const blockedIPs = new Map<string, { until: number; reason: string }>();

/**
 * Bloquea una IP temporalmente
 */
export async function blockIP(
  ip: string,
  durationMs: number,
  reason: string
): Promise<void> {
  const until = Date.now() + durationMs;

  // En memoria
  blockedIPs.set(ip, { until, reason });
}

/**
 * Verifica si una IP está bloqueada
 */
export async function isIPBlocked(
  ip: string
): Promise<{ blocked: boolean; reason?: string; until?: number }> {
  // Verificar en memoria
  const record = blockedIPs.get(ip);
  if (record) {
    if (Date.now() < record.until) {
      return { blocked: true, reason: record.reason, until: record.until };
    }
    blockedIPs.delete(ip);
  }

  return { blocked: false };
}

/**
 * Desbloquea una IP
 */
export async function unblockIP(ip: string): Promise<void> {
  // En memoria
  blockedIPs.delete(ip);
}
