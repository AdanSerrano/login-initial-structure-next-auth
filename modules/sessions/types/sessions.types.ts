import type { DeviceType } from "@/lib/device-parser";
import type { AuditAction } from "@/app/prisma/enums";

export interface SessionData {
  id: string;
  userId: string;
  token: string;
  deviceType: DeviceType | null;
  browser: string | null;
  os: string | null;
  ipAddress: string | null;
  lastActive: Date;
  createdAt: Date;
  isCurrent: boolean;
}

export interface ActivityData {
  id: string;
  action: AuditAction;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  deviceType?: DeviceType;
  browser?: string;
  os?: string;
}

export interface CreateSessionInput {
  userId: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export interface SessionsResult {
  success?: string;
  error?: string;
  sessions?: SessionData[];
}

export interface RevokeSessionResult {
  success?: string;
  error?: string;
}

export interface RevokeAllResult {
  success?: string;
  error?: string;
  count?: number;
}
