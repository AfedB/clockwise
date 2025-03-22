# Guide de gestion des environnements pour Next.js avec Vercel et Supabase

Ce guide explique comment configurer et gérer efficacement les environnements de développement et de production pour une application Next.js déployée sur Vercel et utilisant Supabase.

## Configuration des fichiers d'environnement

### Fichiers locaux

- **`.env.local`**: Contient les variables pour le développement local, pointe vers l'environnement Supabase de développement
- **`.env.example`**: Modèle documentant toutes les variables requises (sans valeurs sensibles)
- **`.gitignore`**: Doit inclure `.env` et `.env.local` pour ne pas exposer de données sensibles

### Structure recommandée pour `.env.example`

```
# Base de données
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Autres services (OAuth, etc.)
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
```

## Environnements Supabase

Pour une séparation claire entre développement et production:

1. **Créez deux projets Supabase distincts**:
   - Un projet pour le développement
   - Un projet pour la production

2. **Utilisez les clés appropriées**:
   - Dans `.env.local`: clés du projet de développement
   - Dans Vercel (production): clés du projet de production

## Configuration de Vercel

Vercel permet de configurer des variables d'environnement spécifiques pour différents environnements:

1. **Variables de Production** (branche `main`):
   - Configurées dans Vercel Dashboard → Project → Settings → Environment Variables
   - Cochez uniquement "Production"
   - Pointent vers les ressources de production (Supabase prod, etc.)

2. **Variables de Preview** (branches autres que `main`):
   - Mêmes variables mais avec des valeurs différentes
   - Cochez uniquement "Preview"
   - Pointent vers les ressources de développement

3. **Variables de Développement** (commande `vercel dev`):
   - Cochez uniquement "Development"
   - Généralement identiques aux variables de Preview

## Workflow de développement

1. **Développement local**:
   - Travaillez sur la branche `develop` (ou une branche de fonctionnalité)
   - Utilisez `.env.local` pointant vers les ressources de développement
   - Testez tout localement avant de pousser les modifications

2. **Déploiement de preview**:
   - Poussez sur GitHub pour déclencher un déploiement de preview sur Vercel
   - Vercel utilise les variables d'environnement de "Preview"
   - Vérifiez que tout fonctionne dans l'environnement de preview

3. **Déploiement en production**:
   - Fusionnez vers `main` après validation sur la preview
   - Vercel déploie automatiquement et utilise les variables de "Production"
   - L'application en production utilise les ressources de production

## Points importants à retenir

- Les fichiers `.env` ne sont **jamais** utilisés lors du déploiement sur Vercel
- Toutes les variables doivent être configurées dans le dashboard Vercel
- Les variables préfixées par `NEXT_PUBLIC_` sont exposées au client
- Utilisez `.env.example` pour documenter les variables requises
- Ne jamais stocker de secrets dans des variables préfixées par `NEXT_PUBLIC_`

En suivant cette structure, vous maintenez une séparation claire entre les environnements tout en simplifiant le processus de développement et de déploiement.