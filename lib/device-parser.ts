export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export interface DeviceInfo {
  deviceType: DeviceType;
  browser: string;
  os: string;
}

const BROWSER_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /Edg\//i, name: "Edge" },
  { pattern: /OPR\//i, name: "Opera" },
  { pattern: /Chrome\//i, name: "Chrome" },
  { pattern: /Safari\//i, name: "Safari" },
  { pattern: /Firefox\//i, name: "Firefox" },
  { pattern: /MSIE|Trident/i, name: "Internet Explorer" },
];

const OS_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /Windows NT 10/i, name: "Windows 10" },
  { pattern: /Windows NT 6.3/i, name: "Windows 8.1" },
  { pattern: /Windows NT 6.2/i, name: "Windows 8" },
  { pattern: /Windows NT 6.1/i, name: "Windows 7" },
  { pattern: /Windows/i, name: "Windows" },
  { pattern: /Mac OS X/i, name: "macOS" },
  { pattern: /iPhone/i, name: "iOS" },
  { pattern: /iPad/i, name: "iPadOS" },
  { pattern: /Android/i, name: "Android" },
  { pattern: /Linux/i, name: "Linux" },
  { pattern: /CrOS/i, name: "Chrome OS" },
];

const MOBILE_PATTERNS = [
  /Mobile/i,
  /Android/i,
  /iPhone/i,
  /iPod/i,
  /BlackBerry/i,
  /Windows Phone/i,
  /Opera Mini/i,
  /IEMobile/i,
];

const TABLET_PATTERNS = [/iPad/i, /Tablet/i, /Android(?!.*Mobile)/i];

function detectBrowser(userAgent: string): string {
  for (const { pattern, name } of BROWSER_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }
  return "Desconocido";
}

function detectOS(userAgent: string): string {
  for (const { pattern, name } of OS_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }
  return "Desconocido";
}

function detectDeviceType(userAgent: string): DeviceType {
  for (const pattern of TABLET_PATTERNS) {
    if (pattern.test(userAgent)) {
      return "tablet";
    }
  }

  for (const pattern of MOBILE_PATTERNS) {
    if (pattern.test(userAgent)) {
      return "mobile";
    }
  }

  return "desktop";
}

export function parseUserAgent(userAgent: string | null | undefined): DeviceInfo {
  if (!userAgent) {
    return {
      deviceType: "unknown",
      browser: "Desconocido",
      os: "Desconocido",
    };
  }

  return {
    deviceType: detectDeviceType(userAgent),
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
  };
}

export function getDeviceLabel(deviceType: DeviceType): string {
  const labels: Record<DeviceType, string> = {
    desktop: "Ordenador",
    mobile: "Móvil",
    tablet: "Tablet",
    unknown: "Dispositivo",
  };
  return labels[deviceType];
}

export function formatSessionInfo(device: DeviceInfo): string {
  return `${device.browser} en ${device.os}`;
}
