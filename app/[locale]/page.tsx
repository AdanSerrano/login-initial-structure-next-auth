import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/header";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  alternates: {
    canonical: APP_URL,
  },
};
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
  Wand2,
  Shield,
  Globe,
  Cloud,
  Users,
  ShieldCheck,
  Gauge,
  MonitorSmartphone,
} from "lucide-react";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("HomePage");
  const tAuth = await getTranslations("Auth");
  const tCommon = await getTranslations("Common");

  const features = [
    {
      icon: UserCheck,
      title: t("features.secureRegistration"),
      description: t("features.secureRegistrationDesc"),
    },
    {
      icon: Mail,
      title: t("features.emailVerification"),
      description: t("features.emailVerificationDesc"),
    },
    {
      icon: Wand2,
      title: t("features.magicLink"),
      description: t("features.magicLinkDesc"),
    },
    {
      icon: Lock,
      title: t("features.passwordRecovery"),
      description: t("features.passwordRecoveryDesc"),
    },
    {
      icon: Smartphone,
      title: t("features.twoFactorAuth"),
      description: t("features.twoFactorAuthDesc"),
    },
    {
      icon: Fingerprint,
      title: t("features.sessionManagement"),
      description: t("features.sessionManagementDesc"),
    },
    {
      icon: Globe,
      title: t("features.internationalization"),
      description: t("features.internationalizationDesc"),
    },
    {
      icon: Cloud,
      title: t("features.cloudStorage"),
      description: t("features.cloudStorageDesc"),
    },
    {
      icon: Users,
      title: t("features.adminDashboard"),
      description: t("features.adminDashboardDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("features.wafSecurity"),
      description: t("features.wafSecurityDesc"),
    },
    {
      icon: Gauge,
      title: t("features.rateLimiting"),
      description: t("features.rateLimitingDesc"),
    },
    {
      icon: MonitorSmartphone,
      title: t("features.pwa"),
      description: t("features.pwaSupportDesc"),
    },
  ];

  const techStack = [
    { name: t("techStack.nextjs"), description: t("techStack.nextjsDesc") },
    { name: t("techStack.react"), description: t("techStack.reactDesc") },
    { name: t("techStack.typescript"), description: t("techStack.typescriptDesc") },
    { name: t("techStack.prisma"), description: t("techStack.prismaDesc") },
    { name: t("techStack.authjs"), description: t("techStack.authjsDesc") },
    { name: t("techStack.tailwind"), description: t("techStack.tailwindDesc") },
    { name: t("techStack.nextIntl"), description: t("techStack.nextIntlDesc") },
    { name: t("techStack.cloudflareR2"), description: t("techStack.cloudflareR2Desc") },
    { name: t("techStack.pwa"), description: t("techStack.pwaDesc") },
  ];

  const benefits = [
    t("benefits.cleanArchitecture"),
    t("benefits.zodValidation"),
    t("benefits.transactionalEmails"),
    t("benefits.darkLightMode"),
    t("benefits.responsiveDesign"),
    t("benefits.gdprCompliance"),
    t("benefits.multiLanguage"),
    t("benefits.fileManagement"),
    t("benefits.enterpriseSecurity"),
    t("benefits.productionReady"),
  ];

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
                  {t("badge")}
                </Badge>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={100}>
                <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight flex flex-col justify-center items-center">
                  {t("title")}{" "}
                  <span className="from-gray-100 to-gray-200 bg-clip-text text-muted-foreground">
                    {t("titleHighlight")}
                  </span>
                </h1>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground md:text-xl px-2">
                  {t("subtitle")}
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
                  {t("featuresSection.badge")}
                </Badge>
                <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
                  {t("featuresSection.title")}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t("featuresSection.subtitle")}
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
                  {t("techSection.badge")}
                </Badge>
                <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
                  {t("techSection.title")}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t("techSection.subtitle")}
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
                    {t("benefitsSection.badge")}
                  </Badge>
                  <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
                    {t("benefitsSection.title")}
                  </h2>
                  <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground">
                    {t("benefitsSection.subtitle")}
                  </p>
                </AnimatedSection>

                <ul className="space-y-2 sm:space-y-3">
                  <AnimatedBenefitsList>
                    {benefits.map((benefit) => (
                      <span key={benefit} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </span>
                        <span className="text-xs sm:text-sm">{benefit}</span>
                      </span>
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
├── auth/
│   ├── login/
│   ├── register/
│   ├── two-factor/
│   └── magic-link/
├── user/
│   ├── profile/
│   ├── security/
│   └── sessions/
├── dashboard/
│   └── admin/
│       ├── users/
│       └── file-manager/
├── file-upload/
│   ├── actions/
│   ├── services/
│   └── repository/
└── lib/
    ├── aws/
    └── security/`}
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
                  {t("ctaSection.title")}
                </h2>
                <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground">
                  {t("ctaSection.subtitle")}
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
                {tAuth("login")}
              </Link>
              <Link href="/register" className="transition-colors hover:text-foreground">
                {tAuth("register")}
              </Link>
              <Link href="/forgot-password" className="transition-colors hover:text-foreground">
                {tAuth("recoverPassword")}
              </Link>
            </nav>

            <p className="text-xs sm:text-sm text-muted-foreground">
              {new Date().getFullYear()} Nexus. {tCommon("allRightsReserved")}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
