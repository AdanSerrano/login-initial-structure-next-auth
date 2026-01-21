"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { MagicLinkForm } from "../components/form/magic-link.form";
import { Wand2 } from "lucide-react";

export const MagicLinkRequestView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 text-center px-4 sm:px-6">
            <AnimatedSection animation="scale" delay={100}>
              <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 mb-2">
                <Wand2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-down" delay={150}>
              <CardTitle className="text-xl font-bold sm:text-2xl">
                Magic Link
              </CardTitle>
            </AnimatedSection>
            <AnimatedSection animation="fade" delay={200}>
              <CardDescription className="text-sm sm:text-base">
                Inicia sesión sin contraseña
              </CardDescription>
            </AnimatedSection>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <AnimatedSection animation="fade-up" delay={300}>
              <MagicLinkForm />
            </AnimatedSection>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};
