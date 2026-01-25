"use client";

import { memo, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

function ModeToggleComponent() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden"
    >
      {/* Sun icon - visible in light mode */}
      <Sun
        className={`h-5 w-5 absolute transition-all duration-300 ease-in-out ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        aria-hidden="true"
      />
      {/* Moon icon - visible in dark mode */}
      <Moon
        className={`h-5 w-5 absolute transition-all duration-300 ease-in-out ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}

export const ModeToggle = memo(ModeToggleComponent);
ModeToggle.displayName = "ModeToggle";
