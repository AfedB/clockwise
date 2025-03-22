## 🚀 Stack Technique

### Frontend
- **Next.js** (15.1.7) - Framework React avec rendu côté serveur
- **React** (19.0.0) - Bibliothèque UI
- **TailwindCSS** (3.4.17) - Framework CSS utilitaire
- **ShadcN/UI** - Composants UI modernes et accessibles
- **Framer Motion** - Animations fluides
- **Sonner** - Notifications élégantes

### Backend & Base de données
- **Supabase** - Base de données PostgreSQL et authentification
- **Prisma** (6.4.1) - ORM pour la gestion de la base de données
- **NextAuth.js** - Authentification complète

### Sécurité & Monitoring
- **Helmet** - Sécurité des en-têtes HTTP
- **Express Rate Limit** - Protection contre les attaques par force brute
- **Pino** - Logging structuré
- **Sentry** - Monitoring des erreurs et performances

### Outils de développement
- **PNPM** - Gestionnaire de paquets rapide et efficace
- **Turbopack** - Bundler nouvelle génération (en mode dev)
- **Zod** - Validation de schémas

## 📁 Structure du Projet

\`\`\`
src/
├── app/                    # Routes et pages Next.js
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants UI de base (ShadcN)
│   └── ...               # Autres composants
├── lib/                   # Utilitaires et configurations
├── middleware/           # Middlewares Next.js
│   ├── security.js       # Configuration sécurité (Helmet, Rate Limit)
│   └── errorMiddleware.js # Gestion globale des erreurs
├── utils/                # Fonctions utilitaires
│   ├── logger.js         # Configuration Pino
│   └── errorHandler.js   # Gestionnaire d'erreurs personnalisé
└── prisma/              # Schémas et migrations Prisma
\`\`\`

## 🔒 Sécurité

- Protection CSRF intégrée
- En-têtes de sécurité avec Helmet
- Rate limiting pour les API
- Validation des données avec Zod
- Gestion sécurisée des sessions avec NextAuth.js

## 📊 Monitoring & Logging

- Logs structurés avec Pino
- Monitoring des erreurs avec Sentry
- Traces de performance
- Replay des sessions en cas d'erreur

## 🚦 Gestion des Erreurs

Système de gestion d'erreurs à trois niveaux :
1. Capture des erreurs avec notre classe \`AppError\`
2. Logging structuré avec Pino
3. Monitoring et alertes avec Sentry

## 🔧 Installation

1. Clonez le repository
2. Installez les dépendances :
   \`\`\`bash
   pnpm install
   \`\`\`
3. Copiez \`.env.example\` vers \`.env.local\` et configurez vos variables d'environnement
4. Initialisez la base de données :
   \`\`\`bash
   pnpm prisma generate
   pnpm prisma db push
   \`\`\`
5. Lancez le serveur de développement :
   \`\`\`bash
   pnpm dev
   \`\`\`

## 📝 Variables d'Environnement Requises

- \`DATABASE_URL\` - URL de connexion Supabase
- \`NEXT_PUBLIC_SUPABASE_URL\` - URL publique Supabase
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` - Clé anonyme Supabase
- \`NEXTAUTH_SECRET\` - Clé secrète pour NextAuth
- \`NEXT_PUBLIC_SENTRY_DSN\` - DSN Sentry

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT
