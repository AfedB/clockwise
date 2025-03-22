import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

// Import des composants shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 border-b">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Votre template NextJS personnel
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-[42rem]">
              Une base solide pour tous vos projets. Simple, moderne et hautement personnalisable.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {session ? (
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Accéder à mon espace
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/login">
                      Se connecter
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/register">
                      S'inscrire
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      {!session && (
        <section className="w-full py-20">
          <Container>
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Fonctionnalités clés
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tout ce dont vous avez besoin pour commencer rapidement.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Interface moderne</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Une expérience utilisateur fluide et agréable grâce aux composants shadcn/ui.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentification intégrée</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Système de connexion sécurisé avec NextAuth pour protéger vos données.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Responsive design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Une application qui s'adapte parfaitement à tous les appareils.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personnalisation facile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Adaptez facilement le design à votre marque et à vos besoins spécifiques.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>
      )}

      {/* About Section */}
      <section className="w-full py-20 bg-muted/50">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              À propos
            </h2>
            <Separator className="my-4 mx-auto w-24" />
            <p className="mt-4 text-muted-foreground">
              Un template personnalisé conçu pour servir de fondation solide à tous vos projets NextJS. Moderne, accessible et prêt à évoluer selon vos besoins.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}