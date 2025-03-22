// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from './components/Navigation';
import { ThemeProvider } from './components/ThemeProvider';

// Import des composants shadcn/ui si nécessaire
import { Sonner } from "@/components/ui/sonner";

// Optionnel : Police Inter de Google Fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Mon application',
  description: 'Description de mon application',
};

export default function RootLayout({ children }) {
  // Simuler un utilisateur connecté ou non (à remplacer par votre logique d'authentification)
  const user = null; // Mettre la session utilisateur ici quand vous implémenterez l'auth

  return (
    <html lang="fr" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navigation user={user} />
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-muted/50">
              <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="text-center text-sm text-muted-foreground md:text-left">
                  <p>© {new Date().getFullYear()} Mon Application. Tous droits réservés.</p>
                </div>
                <nav className="flex items-center gap-4 text-sm font-medium">
                  <a 
                    href="/legal" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Mentions légales
                  </a>
                  <a 
                    href="/privacy" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Confidentialité
                  </a>
                  <a 
                    href="/contact" 
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contact
                  </a>
                </nav>
              </div>
            </footer>
          </div>
          {/* <Sonner /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}