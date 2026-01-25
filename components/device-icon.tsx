"use client";

import { memo } from "react";
import { Monitor, Smartphone, Tablet, Globe } from "lucide-react";
import type { DeviceType } from "@/lib/device-parser";
import { cn } from "@/lib/utils";

interface DeviceIconProps {
  deviceType: DeviceType | null | undefined;
  className?: string;
}

export const DeviceIcon = memo(function DeviceIcon({
  deviceType,
  className = "h-4 w-4",
}: DeviceIconProps) {
  const iconClass = cn(className);

  switch (deviceType) {
    case "desktop":
      return <Monitor className={iconClass} />;
    case "mobile":
      return <Smartphone className={iconClass} />;
    case "tablet":
      return <Tablet className={iconClass} />;
    default:
      return <Globe className={iconClass} />;
  }
});
