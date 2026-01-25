import { memo } from "react";

const APP_NAME = "Nexus";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const APP_DESCRIPTION =
  "Sistema de autenticación completo y seguro con verificación de email, autenticación de dos factores (2FA), recuperación de contraseña y arquitectura modular.";

// ============================================================================
// TIPOS
// ============================================================================

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface OrganizationProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

interface WebApplicationProps {
  name?: string;
  url?: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// ============================================================================
// COMPONENTES JSON-LD
// ============================================================================

/**
 * Schema.org Organization markup
 * Mejora la presencia en búsquedas de Google
 */
const OrganizationJsonLdComponent = ({
  name = APP_NAME,
  url = APP_URL,
  logo = `${APP_URL}/icon.png`,
  description = APP_DESCRIPTION,
}: OrganizationProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo: {
      "@type": "ImageObject",
      url: logo,
      width: 512,
      height: 512,
    },
    description,
    sameAs: ["https://github.com/AdanSerrano"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Spanish", "English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

OrganizationJsonLdComponent.displayName = "OrganizationJsonLd";
export const OrganizationJsonLd = memo(OrganizationJsonLdComponent);

/**
 * Schema.org WebApplication markup
 * Identifica la aplicación como software web
 */
const WebApplicationJsonLdComponent = ({
  name = APP_NAME,
  url = APP_URL,
  description = APP_DESCRIPTION,
  applicationCategory = "SecurityApplication",
  operatingSystem = "Any",
}: WebApplicationProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    description,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Email verification",
      "Two-factor authentication (2FA)",
      "Password recovery",
      "Session management",
      "Role-based access control",
    ],
    screenshot: `${APP_URL}/icon.png`,
    softwareVersion: "1.0.0",
    author: {
      "@type": "Person",
      name: "Adan Serrano",
      url: "https://github.com/AdanSerrano",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

WebApplicationJsonLdComponent.displayName = "WebApplicationJsonLd";
export const WebApplicationJsonLd = memo(WebApplicationJsonLdComponent);

/**
 * Schema.org BreadcrumbList markup
 * Mejora la navegación en resultados de búsqueda
 */
const BreadcrumbJsonLdComponent = ({ items }: BreadcrumbProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

BreadcrumbJsonLdComponent.displayName = "BreadcrumbJsonLd";
export const BreadcrumbJsonLd = memo(BreadcrumbJsonLdComponent);

/**
 * Schema.org WebSite markup con SearchAction
 * Habilita el cuadro de búsqueda en Google
 */
const WebSiteJsonLdComponent = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    inLanguage: "es-ES",
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/icon.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

WebSiteJsonLdComponent.displayName = "WebSiteJsonLd";
export const WebSiteJsonLd = memo(WebSiteJsonLdComponent);

/**
 * Componente combinado para el layout principal
 * Incluye Organization + WebApplication + WebSite
 */
const RootJsonLdComponent = () => {
  return (
    <>
      <OrganizationJsonLd />
      <WebApplicationJsonLd />
      <WebSiteJsonLd />
    </>
  );
};

RootJsonLdComponent.displayName = "RootJsonLd";
export const RootJsonLd = memo(RootJsonLdComponent);
