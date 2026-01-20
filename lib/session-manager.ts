import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { parseUserAgent } from "./device-parser";

export interface CreateSessionData {
  userId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export async function createUserSession(data: CreateSessionData) {
  const token = uuidv4();
  const deviceInfo = parseUserAgent(data.userAgent);

  try {
    const session = await db.session.create({
      data: {
        userId: data.userId,
        token,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress: data.ipAddress,
      },
    });

    return { session, token };
  } catch (error) {
    console.error("Error creating user session:", error);
    return null;
  }
}

export async function updateSessionActivity(token: string) {
  try {
    await db.session.update({
      where: { token },
      data: { lastActive: new Date() },
    });
  } catch (error) {
    console.error("Error updating session activity:", error);
  }
}

export async function deleteSessionByToken(token: string) {
  try {
    await db.session.delete({
      where: { token },
    });
    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
}

export async function deleteAllUserSessions(userId: string) {
  try {
    await db.session.deleteMany({
      where: { userId },
    });
    return true;
  } catch (error) {
    console.error("Error deleting all user sessions:", error);
    return false;
  }
}

export async function isSessionValid(token: string): Promise<boolean> {
  try {
    const session = await db.session.findUnique({
      where: { token },
      select: { id: true },
    });
    return session !== null;
  } catch (error) {
    console.error("Error checking session validity:", error);
    return false;
  }
}
