"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useMemo } from "react";

interface PasswordRequirement {
  label: string;
  regex: RegExp;
}

const requirements: PasswordRequirement[] = [
  { label: "Al menos 8 caracteres", regex: /.{8,}/ },
  { label: "Una letra mayúscula", regex: /[A-Z]/ },
  { label: "Una letra minúscula", regex: /[a-z]/ },
  { label: "Un número", regex: /[0-9]/ },
  { label: "Un carácter especial", regex: /[!@#$%^&*(),.?":{}|<>]/ },
];

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => {
    const passedRequirements = requirements.filter((req) =>
      req.regex.test(password)
    );
    const score = passedRequirements.length;

    if (score === 0) return { label: "", color: "bg-muted", percentage: 0 };
    if (score <= 2)
      return { label: "Débil", color: "bg-red-500", percentage: 33 };
    if (score <= 4)
      return { label: "Media", color: "bg-yellow-500", percentage: 66 };
    return { label: "Fuerte", color: "bg-green-500", percentage: 100 };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Barra de progreso */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Fortaleza:</span>
          <span
            className={cn(
              "font-medium",
              strength.percentage <= 33 && "text-red-500",
              strength.percentage > 33 &&
                strength.percentage <= 66 &&
                "text-yellow-500",
              strength.percentage > 66 && "text-green-500"
            )}
          >
            {strength.label}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              strength.color
            )}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      <ul className="space-y-1 text-xs">
        {requirements.map((req) => {
          const passed = req.regex.test(password);
          return (
            <li
              key={req.label}
              className={cn(
                "flex items-center gap-2 transition-colors",
                passed ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {passed ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
