"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { ForgotPasswordForm } from "../components/form/forgot-password.form";

export function ForgotPasswordView() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
        <ForgotPasswordForm />
      </AnimatedSection>
    </div>
  );
}
