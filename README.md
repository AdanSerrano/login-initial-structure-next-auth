# Structure - Next.js Authentication Boilerplate

Sistema de autenticación completo con arquitectura limpia, diseñado para ser escalable y fácilmente migrable.

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **UI** | Tailwind CSS 4 + shadcn/ui + Aceternity UI |
| **Autenticación** | Auth.js v5 (NextAuth) |
| **Base de Datos** | PostgreSQL + Prisma 7 |
| **Validación** | Zod 4 + React Hook Form |
| **Email** | Resend + React Email |
| **Runtime** | Bun |

## Funcionalidades

### Autenticación
- Registro de usuarios con verificación por email
- Login con credenciales (email o nombre de usuario)
- Magic Link (login sin contraseña vía email)
- Autenticación de dos factores (2FA) por email
- Recuperación de contraseña
- Rate limiting para protección contra fuerza bruta
- Indicador de fortaleza de contraseña

### Seguridad
- **Google reCAPTCHA v3** - Protección invisible contra bots en login, registro y magic link
- **Cookies GDPR** - Banner de consentimiento de cookies con preferencias personalizables:
  - Cookies necesarias (siempre activas)
  - Cookies analíticas (opcional)
  - Cookies funcionales (opcional)

### UI/UX
- Diseño responsive (mobile-first)
- Tema claro/oscuro
- Skeleton loaders para mejor experiencia de carga

## Inicio Rápido

### Requisitos

- [Bun](https://bun.sh/) >= 1.0
- PostgreSQL >= 14
- Cuenta en [Resend](https://resend.com/) (para emails)

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd structure

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env.local
```

### Variables de Entorno

Edita `.env.local` con tus credenciales:

```bash
# Auth.js - Clave secreta para firmar tokens de sesión
# Generar con: npx auth secret
AUTH_SECRET=

# PostgreSQL - URL de conexión a la base de datos
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=

# Resend - API key para envío de emails transaccionales
# Obtener en: https://resend.com/api-keys
RESEND_API_KEY=

# Resend - Email remitente verificado en Resend
RESEND_FROM_EMAIL=

# URL pública de la aplicación (sin slash al final)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google reCAPTCHA v3 - Protección contra bots
# Obtener en: https://www.google.com/recaptcha/admin/create
# Seleccionar "reCAPTCHA v3" y agregar tu dominio (localhost para desarrollo)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

### Base de Datos

```bash
# Generar cliente de Prisma
bunx prisma generate

# Aplicar schema a la base de datos
bunx prisma db push

# (Opcional) Abrir Prisma Studio
bun run db:studio
```

### Ejecutar

```bash
# Desarrollo
bun run dev

# Producción
bun run build
bun run start
```

## Arquitectura

El proyecto sigue una arquitectura modular con separación estricta de capas:

```
modules/
└── {feature}/
    ├── actions/          # Server Actions (entry point)
    ├── components/       # Componentes UI + emails
    ├── controllers/      # Delegadores
    ├── emails/           # Servicios de envío de email
    ├── hooks/            # Lógica de UI (React hooks)
    ├── repository/       # Acceso a datos (abstracción DB)
    ├── services/         # Lógica de negocio
    ├── state/            # Estado global (Zustand)
    ├── validations/      # Schemas Zod + validaciones
    ├── view/             # Componentes página
    └── view-model/       # Bridge entre view y hooks
```

### Flujo de Datos

```
view → actions → controllers → services → repository → db
```

Cada capa tiene una responsabilidad única y solo puede comunicarse con la capa adyacente.

## Módulos Disponibles

| Módulo | Descripción |
|--------|-------------|
| `login` | Autenticación con email/username + reCAPTCHA |
| `register` | Registro de usuarios + reCAPTCHA |
| `magic-link` | Login sin contraseña vía email + reCAPTCHA |
| `two-factor` | Autenticación de dos factores (2FA) |
| `register-success` | Página de éxito post-registro |
| `verify-email` | Verificación de email |
| `resend-verification` | Reenvío de email de verificación |
| `forgot-password` | Solicitud de reset de contraseña |
| `reset-password` | Cambio de contraseña |
| `logout` | Cierre de sesión |
| `settings/security` | Configuración de seguridad del usuario |
| `services` | Dashboard de usuario autenticado |

## Comandos

```bash
# Desarrollo
bun run dev              # Servidor de desarrollo
bun run build            # Build de producción
bun run lint             # ESLint

# Base de datos
bun run db:studio        # Prisma Studio
bun run db:test          # Test de conexión
bunx prisma generate     # Generar cliente
bunx prisma db push      # Push schema
bunx prisma migrate dev  # Migraciones
```

## Componentes de Seguridad

### reCAPTCHA v3
Protección invisible contra bots integrada en:
- Formulario de login
- Formulario de registro
- Solicitud de magic link

El badge de reCAPTCHA solo se muestra en la página de login para indicar la protección.

### Cookie Consent (GDPR)
Banner de consentimiento que aparece en la primera visita:
- No se puede cerrar sin seleccionar una opción
- Guarda preferencias por 365 días
- Permite configurar cookies analíticas y funcionales
- Cookies necesarias siempre activas (requeridas para seguridad)

## Documentación

- [Auth.js](https://authjs.dev/) - Documentación de autenticación
- [Prisma](https://www.prisma.io/docs) - Documentación de ORM
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Resend](https://resend.com/docs) - Envío de emails
- [React Email](https://react.email/) - Componentes de react email
- [Zustand](https://zustand-demo.pmnd.rs/) - Manejador de estados
- [Google reCAPTCHA](https://developers.google.com/recaptcha/docs/v3) - Protección contra bots

## Licencia

MIT
