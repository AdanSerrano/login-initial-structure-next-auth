"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Mail, MessageSquare, Send, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-semibold">Nexus</span>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8 sm:py-12 md:py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <AnimatedSection animation="fade-up" delay={0}>
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                Contáctanos
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                ¿Tienes preguntas o comentarios? Nos encantaría escucharte.
                Completa el formulario y te responderemos lo antes posible.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Contact Info Cards */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-1">
              <AnimatedSection animation="fade-right" delay={100}>
                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm sm:text-base">Email</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                          soporte@nexus.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" delay={200}>
                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm sm:text-base">Teléfono</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" delay={300}>
                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm sm:text-base">Ubicación</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Ciudad de México, México
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <AnimatedSection animation="fade-up" delay={200} className="lg:col-span-2">
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Envíanos un mensaje</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Completa el formulario y te responderemos en menos de 24 horas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form className="space-y-4 sm:space-y-6">
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm">Nombre</Label>
                        <Input
                          id="name"
                          placeholder="Tu nombre"
                          className="h-10 sm:h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          className="h-10 sm:h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm">Asunto</Label>
                      <Input
                        id="subject"
                        placeholder="¿En qué podemos ayudarte?"
                        className="h-10 sm:h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm">Mensaje</Label>
                      <Textarea
                        id="message"
                        placeholder="Escribe tu mensaje aquí..."
                        rows={5}
                        className="resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="container px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {new Date().getFullYear()} Nexus. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
