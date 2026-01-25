import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/header";
import { HeroButtons } from "@/components/landing/hero-buttons";
import { CtaButtons, BenefitsButton } from "@/components/landing/cta-buttons";
import {
  AnimatedFeatureGrid,
  AnimatedTechGrid,
  AnimatedBenefitsList,
} from "@/components/landing/animated-sections";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Lock,
  KeyRound,
  Mail,
  UserCheck,
  Smartphone,
  Fingerprint,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  Code2,
  Cookie,
  Wand2,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Registro seguro",
    description:
      "Sistema de registro con validación de email y contraseñas seguras con indicador de fortaleza.",
  },
  {
    icon: Mail,
    title: "Verificación de email",
    description:
      "Flujo completo de verificación de correo electrónico con tokens seguros y reenvío automático.",
  },
  {
    icon: Wand2,
    title: "Magic Link",
    description:
      "Inicio de sesión sin contraseña mediante enlace seguro enviado por email.",
  },
  {
    icon: Lock,
    title: "Recuperación de contraseña",
    description:
      "Proceso seguro de recuperación con enlaces temporales y validación de tokens.",
  },
  {
    icon: Smartphone,
    title: "Autenticación 2FA",
    description:
      "Verificación en dos pasos mediante código OTP enviado por email para mayor seguridad.",
  },
  {
    icon: Fingerprint,
    title: "Gestión de sesiones",
    description:
      "Sesiones JWT con expiración configurable y protección de rutas automática.",
  },
  {
    icon: Shield,
    title: "Protección avanzada",
    description:
      "Rate limiting, bloqueo de cuentas por intentos fallidos y auditoría de accesos.",
  },
  {
    icon: Cookie,
    title: "Gestión de cookies GDPR",
    description:
      "Banner de consentimiento con preferencias personalizables: cookies necesarias, analíticas y funcionales.",
  },
];

const techStack = [
  { name: "Next.js 16", description: "App Router + Turbopack" },
  { name: "React 19", description: "Server Components" },
  { name: "TypeScript", description: "Type-safe" },
  { name: "Prisma", description: "ORM + PostgreSQL" },
  { name: "Auth.js v5", description: "NextAuth Beta" },
  { name: "Tailwind CSS", description: "shadcn/ui" },
];

const benefits = [
  "Arquitectura limpia y modular",
  "Validación con Zod en cliente y servidor",
  "Emails transaccionales con React Email",
  "Soporte para dark/light mode",
  "Diseño responsive mobile-first",
  "Cumplimiento GDPR con gestión de cookies",
  "Listo para producción",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />

          <div className="container px-4 py-16 sm:py-24 md:px-6 md:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <AnimatedSection animation="fade-down" delay={0}>
                <Badge variant="secondary" className="mb-4">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Next.js 16 + Auth.js v5
                </Badge>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Sistema de autenticación{" "}
                  <span className="from-gray-100 to-gray-200 bg-clip-text  text-muted-foreground">
                    completo y seguro
                  </span>
                </h1>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground md:text-xl px-2">
                  Boilerplate de autenticación production-ready con arquitectura limpia,
                  verificación de email, 2FA, gestión de cookies GDPR y mucho más.
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={300}>
                <HeroButtons />
              </AnimatedSection>

              <AnimatedSection animation="fade" delay={400}>
                <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 text-xs sm:text-sm text-muted-foreground">
                  {techStack.slice(0, 4).map((tech) => (
                    <div key={tech.name} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-b py-16 sm:py-24">
          <div className="container px-4 md:px-6">
            <AnimatedSection animation="fade-up" delay={0}>
              <div className="mx-auto max-w-2xl text-center">
                <Badge variant="outline" className="mb-4">
                  Características
                </Badge>
                <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
                  Todo lo que necesitas para autenticación
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Funcionalidades completas de autenticación implementadas siguiendo
                  las mejores prácticas de seguridad.
                </p>
              </div>
            </AnimatedSection>

            <div className="mx-auto mt-10 sm:mt-16 grid max-w-5xl gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatedFeatureGrid>
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="group relative rounded-2xl border bg-card p-4 sm:p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mb-1 sm:mb-2 text-base sm:text-lg font-semibold">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </AnimatedFeatureGrid>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech" className="border-b bg-muted/30 py-16 sm:py-24">
          <div className="container px-4 md:px-6">
            <AnimatedSection animation="fade-up" delay={0}>
              <div className="mx-auto max-w-2xl text-center">
                <Badge variant="outline" className="mb-4">
                  <Code2 className="mr-1 h-3 w-3" />
                  Stack tecnológico
                </Badge>
                <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
                  Construido con las mejores tecnologías
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Stack moderno y actualizado para desarrollo rápido y mantenible.
                </p>
              </div>
            </AnimatedSection>

            <div className="mx-auto mt-8 sm:mt-12 grid max-w-4xl gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatedTechGrid>
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-3 sm:gap-4 rounded-xl border bg-card p-3 sm:p-4"
                  >
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{tech.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                ))}
              </AnimatedTechGrid>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="border-b py-16 sm:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-8 sm:gap-12 lg:grid-cols-2">
              <div>
                <AnimatedSection animation="fade-right" delay={0}>
                  <Badge variant="outline" className="mb-4">
                    <Layers className="mr-1 h-3 w-3" />
                    Arquitectura
                  </Badge>
                  <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
                    Código limpio y escalable
                  </h2>
                  <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground">
                    Arquitectura modular con separación de responsabilidades clara.
                    Cada módulo es independiente y fácil de mantener o extender.
                  </p>
                </AnimatedSection>

                <ul className="space-y-2 sm:space-y-3">
                  <AnimatedBenefitsList>
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <span className="text-xs sm:text-sm">{benefit}</span>
                      </li>
                    ))}
                  </AnimatedBenefitsList>
                </ul>

                <AnimatedSection animation="fade-up" delay={600}>
                  <div className="mt-6 sm:mt-8">
                    <BenefitsButton />
                  </div>
                </AnimatedSection>
              </div>

              <AnimatedSection animation="scale" delay={200}>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 blur-2xl" />
                  <div className="relative rounded-2xl border bg-card p-4 sm:p-6 shadow-xl">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500" />
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500" />
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500" />
                    </div>
                    <pre className="overflow-x-auto text-[10px] sm:text-xs md:text-sm">
                      <code className="text-muted-foreground">
{`modules/
├── login/
│   ├── actions/
│   ├── components/
│   ├── controllers/
│   ├── hooks/
│   ├── repository/
│   ├── services/
│   ├── validations/
│   └── view/
├── register/
├── two-factor/
├── user/
└── ...`}
                      </code>
                    </pre>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 md:px-6">
            <AnimatedSection animation="slide-up" delay={0}>
              <div className="mx-auto max-w-3xl rounded-2xl border from-primary/5 via-background to-primary/5 p-6 sm:p-8 text-center shadow-lg md:p-12">
                <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold md:text-3xl">
                  Comienza a construir hoy
                </h2>
                <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground">
                  Crea tu cuenta y explora todas las funcionalidades del sistema de
                  autenticación.
                </p>
                <CtaButtons />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto border-t py-8 sm:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
                <KeyRound className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
              <span className="text-base sm:text-lg font-semibold">Nexus</span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <Link href="/login" className="transition-colors hover:text-foreground">
                Iniciar sesión
              </Link>
              <Link href="/register" className="transition-colors hover:text-foreground">
                Registrarse
              </Link>
              <Link href="/forgot-password" className="transition-colors hover:text-foreground">
                Recuperar contraseña
              </Link>
            </nav>

            <p className="text-xs sm:text-sm text-muted-foreground">
              {new Date().getFullYear()} Nexus. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
