// Rate limiting simple en memoria
// Para producción, considera usar Redis con @upstash/ratelimit

interface RateLimitEntry {
  count: number;
  lastReset: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Configuración
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5; // 5 intentos por ventana

export const checkRateLimit = (
  identifier: string
): { allowed: boolean; remainingAttempts: number; resetIn: number } => {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // Si no hay entrada o la ventana expiró, crear nueva
  if (!entry || now - entry.lastReset > WINDOW_MS) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1,
      resetIn: WINDOW_MS,
    };
  }

  // Si está dentro de la ventana
  if (entry.count >= MAX_ATTEMPTS) {
    const resetIn = WINDOW_MS - (now - entry.lastReset);
    return {
      allowed: false,
      remainingAttempts: 0,
      resetIn,
    };
  }

  // Incrementar contador
  entry.count++;
  rateLimitMap.set(identifier, entry);

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - entry.count,
    resetIn: WINDOW_MS - (now - entry.lastReset),
  };
};

export const resetRateLimit = (identifier: string): void => {
  rateLimitMap.delete(identifier);
};

// Limpiar entradas expiradas periódicamente (evitar memory leaks)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }
}, WINDOW_MS);

// Helper para formatear tiempo restante
export const formatResetTime = (ms: number): string => {
  const minutes = Math.ceil(ms / 60000);
  if (minutes === 1) return "1 minuto";
  return `${minutes} minutos`;
};
