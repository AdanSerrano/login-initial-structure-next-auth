/**
 * Health Check Endpoint
 *
 * Endpoint para verificar el estado del sistema.
 * Útil para:
 * - Load balancers
 * - Kubernetes probes
 * - Monitoreo externo
 */

import { NextResponse } from "next/server";
import { db } from "@/utils/db";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: { status: "up" | "down"; latency?: number };
    memory: { used: number; total: number; percentage: number };
  };
}

// Tiempo de inicio del servidor
const startTime = Date.now();

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const checks = {
    database: { status: "down" as "up" | "down", latency: undefined as number | undefined },
    memory: { used: 0, total: 0, percentage: 0 },
  };

  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

  // Check Database
  try {
    const dbStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    checks.database = {
      status: "up",
      latency: Date.now() - dbStart,
    };
  } catch {
    checks.database = { status: "down", latency: undefined };
    overallStatus = "unhealthy";
  }

  // Check Memory (Node.js)
  try {
    const memUsage = process.memoryUsage();
    const totalMemory = require("os").totalmem();
    checks.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(totalMemory / 1024 / 1024),
      percentage: Math.round((memUsage.heapUsed / totalMemory) * 100),
    };

    // Si el uso de memoria es muy alto, marcar como degradado
    if (checks.memory.percentage > 85) {
      overallStatus = overallStatus === "healthy" ? "degraded" : overallStatus;
    }
  } catch {
    // Ignorar errores de memoria
  }

  const response: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks,
  };

  // Retornar 503 si no está healthy
  const statusCode = overallStatus === "unhealthy" ? 503 : 200;

  return NextResponse.json(response, { status: statusCode });
}
