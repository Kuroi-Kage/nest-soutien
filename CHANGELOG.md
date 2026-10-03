# Changelog

Format : [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [0.1.0] - 2026-10-03

### Added
- Modules : auth, users, conversations, risk, journal, posts, reports, music, notifications, groups
- Validation des variables d'environnement (Joi)
- Guard JWT global avec décorateur `@Public()`
- Tests unitaires : RiskService, PasswordService, JournalService

### Fixed
- Export incorrect dans UsersModule
- Ordre du spread dans JournalService.create() écrasant encryptedContent
- Faute de frappe dans JournalService.remove() (sucess → success)
- Conflit de version @nestjs/passport
- ConfigModule manquant empêchant le chargement de .env
- Providers dupliqués dans AppModule