import { db } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hora

  // Normalizar email a minúsculas
  const normalizedEmail = email.toLowerCase();

  // Eliminar token existente si hay uno
  const existingToken = await db.verificationToken.findFirst({
    where: { email: normalizedEmail },
  });

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email: normalizedEmail,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    // Normalizar email a minúsculas
    const verificationToken = await db.verificationToken.findFirst({
      where: { email: email.toLowerCase() },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hora

  // Normalizar email a minúsculas
  const normalizedEmail = email.toLowerCase();

  const existingToken = await db.passwordResetToken.findFirst({
    where: { email: normalizedEmail },
  });

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email: normalizedEmail,
      token,
      expires,
    },
  });

  return passwordResetToken;
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    // Normalizar email a minúsculas
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email: email.toLowerCase() },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

const generateSixDigitCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateTwoFactorToken = async (email: string) => {
  const token = generateSixDigitCode();
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutos

  // Normalizar email a minúsculas
  const normalizedEmail = email.toLowerCase();

  const existingToken = await db.twoFactorToken.findFirst({
    where: { email: normalizedEmail },
  });

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email: normalizedEmail,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    // Normalizar email a minúsculas
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email: email.toLowerCase() },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const deleteTwoFactorToken = async (id: string) => {
  try {
    await db.twoFactorToken.delete({
      where: { id },
    });
  } catch {
    return null;
  }
};
