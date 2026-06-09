# Zooda Monorepo

Welcome to the structured Zooda Monorepo codebase.

## Directory Structure
- **apps/**: Applications including `user-web` (storefront), `client-web` (client dashboard), and `admin-web` (admin portal).
- **backend/**: The modularized Express server backend code structured under `src/`.
- **shared/**: Reusable elements shared across multiple apps (UI components, utils, validators).
- **infrastructure/**: Dockerfiles and reverse proxy configurations (Nginx).

## Commands

Run specific applications:
```bash
# Start backend
npm run dev:backend

# Start apps
npm run dev:user
npm run dev:client
npm run dev:admin
```
