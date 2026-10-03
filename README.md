<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


# Soutien Mental API 

API NestJS pour une plateforme de soutien psychologique et bien-être 

## Stack

- NestJS 12 (ESM)
- PostgreSQL 16 + Prisma 7
- JWT (`@nestjs/jwt`, `@nestjs/passport`) + bcrypt
- Vitest

## Prérequis

- Node.js ≥ 20
- Docker

## Installation

\`\`\`bash
npm install
docker compose up -d
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
\`\`\`

## Variables d'environnement

| Variable | Requis | Défaut | Description |
|---|---|---|---|
| `DATABASE_URL` | oui | - | Connexion PostgreSQL |
| `JWT_SECRET` | oui | - | ≥ 32 caractères |
| `JWT_EXPIRES_IN` | non | `7d` | Durée de validité du token |
| `CONTENT_ENCRYPTION_SECRET` | oui |  | ≥ 32 caractères |
| `CORS_ORIGIN` | non | `*` | Origines autorisées |
| `AI_GATEWAY_URL` | non | - | Endpoint du service IA |
| `AI_GATEWAY_API_KEY` | non | - | Clé du service IA |

Générer un secret : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Validation au démarrage via Joi (`src/app.module.ts`).

## Architecture

Motif par fonctionnalité : `*.controller.ts` → `*.service.ts` → `PrismaService`.

- **Contrôleur** : validation (DTO + `class-validator`), aucune logique métier
- **Service** : logique métier, seul point d'accès à Prisma
- **DTO** (`dto/*.dto.ts`) : contrat d'entrée, découplé du schéma Prisma
- **Guards globaux** : `JwtAuthGuard` (via `APP_GUARD`), exemption par `@Public()`
- **Guards par rôle** : `RolesGuard` + `@Roles(...)`, rôles `STANDARD` / `MODERATOR` / `ADMIN`
- **Ownership check** : chaque accès à une ressource utilisateur filtre sur `{ id, userId }`

\`\`\`
src/
├── auth/            inscription, connexion, JWT, guards
├── users/           profil, confidentialité, RGPD
├── conversations/   chatbot
├── risk/            détection de risque, ressources d'urgence
├── journal/         journal personnel chiffré
├── posts/           publications communautaires
├── reports/         signalement, modération
├── music/           catalogue musical
├── notifications/   notifications planifiées
├── groups/          groupes de discussion
├── prisma/          PrismaService (global)
└── common/          decorators, guards, crypto.util
\`\`\`

## Points d'attention

- Chiffrement (`src/common/crypto.util.ts`) : AES-256-GCM côté serveur.
- Détection de risque (`src/risk/risk.service.ts`) : mots-clés, MVP.
- `AiGatewayClient` : seul point de contact avec le LLM, clé API côté serveur.
- `NotificationsService.dispatchDueNotifications()` : à brancher sur un cron, non exposé en HTTP.

## Tests

\`\`\`bash
npm test
\`\`\`