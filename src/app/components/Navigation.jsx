"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Import des composants shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Import des icônes Lucide (recommandées par shadcn/ui)
import {
  Menu,
  Home,
  Info,
  LayoutDashboard,
  Settings,
  LogIn,
  UserPlus,
  ChevronDown,
} from "lucide-react";

export default function Navigation({ user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Accueil",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/about",
      label: "À propos",
      icon: Info,
      active: pathname === "/about",
    },
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
      requiresAuth: true,
    },
    {
      href: "/settings",
      label: "Paramètres",
      icon: Settings,
      active: pathname === "/settings",
      requiresAuth: true,
    },
  ];

  return (
    <header className="p-2 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-2 text-lg font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Mon Application</span>
                </Link>
                <nav className="flex flex-col gap-2">
                  {routes.map(
                    (route) =>
                      (!route.requiresAuth || (route.requiresAuth && user)) && (
                        <Link
                          key={route.href}
                          href={route.href}
                          className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium ${
                            route.active
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          <route.icon className="h-4 w-4" />
                          {route.label}
                        </Link>
                      )
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Mon Application</span>
          </Link>
        </div>

        {/* Navigation pour desktop */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Accueil
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  À propos
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Ressources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/documentation"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Documentation
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Consultez notre documentation complète.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <Link href="/tutoriels" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">
                          Tutoriels
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Apprenez à utiliser toutes les fonctionnalités
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" legacyBehavior passHref>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">
                          FAQ
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Questions fréquemment posées
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Tableau de bord
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">
                  <LogIn className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
