/**
 * Sistema de Seguridad - Exports Centralizados
 *
 * Módulos disponibles:
 * - Rate Limiter: Control de tasa de requests (en memoria)
 * - Logger: Logging estructurado de seguridad
 * - Alerts: Sistema de alertas y notificaciones
 * - WAF: Web Application Firewall
 */

// Rate Limiter
export {
  checkRateLimit,
  resetRateLimit,
  getRateLimitHeaders,
  createRateLimiter,
  blockIP,
  isIPBlocked,
  unblockIP,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
  type RateLimitResult,
  type RateLimitType,
} from "./rate-limiter";

// Logger
export {
  securityLog,
  logAuthSuccess,
  logAuthFailure,
  logLogout,
  logRateLimitExceeded,
  logSuspiciousActivity,
  logBlockedRequest,
  logWAFTriggered,
  logBruteForceDetected,
  logDataAccess,
  logAdminAction,
  getRecentLogs,
  getSecurityStats,
  clearLogBuffer,
  baseLogger,
  securityLogger,
  type SecurityLogLevel,
  type SecurityLogContext,
  type SecurityEventType,
  type SecurityLog,
} from "./logger";

// Alerts
export {
  recordSecurityEvent,
  getActiveAlerts,
  acknowledgeAlert,
  getAlertRules,
  updateAlertRule,
  addAlertRule,
  removeAlertRule,
  getAlertStats,
  triggerManualAlert,
  DEFAULT_ALERT_RULES,
  type AlertSeverity,
  type AlertChannel,
  type Alert,
  type AlertRule,
} from "./alerts";

// WAF
export {
  analyzeRequest,
  analyzePath,
  analyzeUserAgent,
  getWAFRules,
  setRuleEnabled,
  getWAFStats,
  clearViolationHistory,
  WAF_RULES,
  type WAFResult,
  type WAFCategory,
  type WAFRule,
} from "./waf";
