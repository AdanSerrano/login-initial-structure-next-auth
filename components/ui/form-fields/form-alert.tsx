"use client";

import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import type { AlertVariant } from "./form-field.types";

const ALERT_STYLES: Record<
  AlertVariant,
  { container: string; icon: typeof AlertCircle }
> = {
  error: {
    container:
      "bg-destructive/10 border-destructive/20 text-destructive",
    icon: AlertCircle,
  },
  success: {
    container: "bg-green-500/10 border-green-500/20 text-green-600",
    icon: CheckCircle2,
  },
  warning: {
    container: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    icon: AlertTriangle,
  },
  info: {
    container: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    icon: Info,
  },
};

export interface FormAlertProps {
  variant?: AlertVariant;
  message?: string | null;
  title?: string;
  children?: ReactNode;
  className?: string;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

function FormAlertComponent({
  variant = "error",
  message,
  title,
  children,
  className,
  showIcon = true,
  dismissible = false,
  onDismiss,
}: FormAlertProps) {
  if (!message && !children) return null;

  const styles = ALERT_STYLES[variant];
  const Icon = styles.icon;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "rounded-lg border p-3 text-sm",
        styles.container,
        className
      )}
    >
      <div className="flex gap-3">
        {showIcon && <Icon className="h-5 w-5 shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          {title && <p className="font-medium">{title}</p>}
          {message && <p className={title ? "mt-1" : ""}>{message}</p>}
          {children}
        </div>
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export const FormAlert = memo(FormAlertComponent);
FormAlert.displayName = "FormAlert";

export interface FormErrorAlertProps {
  error?: string | null;
  className?: string;
}

function FormErrorAlertComponent({ error, className }: FormErrorAlertProps) {
  return <FormAlert variant="error" message={error} className={className} />;
}

export const FormErrorAlert = memo(FormErrorAlertComponent);
FormErrorAlert.displayName = "FormErrorAlert";

export interface FormSuccessAlertProps {
  message?: string | null;
  className?: string;
}

function FormSuccessAlertComponent({
  message,
  className,
}: FormSuccessAlertProps) {
  return <FormAlert variant="success" message={message} className={className} />;
}

export const FormSuccessAlert = memo(FormSuccessAlertComponent);
FormSuccessAlert.displayName = "FormSuccessAlert";

export interface FormInfoBoxProps {
  title?: string;
  message?: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

function FormInfoBoxComponent({
  title,
  message,
  children,
  icon,
  className,
}: FormInfoBoxProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/30 p-4",
        className
      )}
    >
      <div className="flex gap-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          {title && <p className="font-medium text-sm">{title}</p>}
          {message && (
            <p className={cn("text-sm text-muted-foreground", title && "mt-1")}>
              {message}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export const FormInfoBox = memo(FormInfoBoxComponent);
FormInfoBox.displayName = "FormInfoBox";
