"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from '../../lib/supabase';

// Import des composants Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginContent
        formData={formData}
        setFormData={setFormData}
        error={error}
        setError={setError}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        loading={loading}
        setLoading={setLoading}
        router={router}
      />
    </Suspense>
  );
}

function LoginContent({
  formData,
  setFormData,
  error,
  setError,
  successMessage,
  setSuccessMessage,
  loading,
  setLoading,
  router,
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("registered") === "true") {
      setSuccessMessage(
        "Inscription réussie! Vous pouvez maintenant vous connecter."
      );
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      router.push("/dashboard");
    } catch (error) {
      setError(error.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      setError(error.message || "Erreur de connexion avec Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-center text-2xl font-bold">Connexion</h2>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="bg-green-50 border-green-500 text-green-700">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Votre mot de passe"
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.617 0 3.081.607 4.202 1.597L19.147 4.7C17.2 2.966 14.777 2 12 2 8.134 2 4.89 4.112 3.211 7.135l3.034 2.347C7.144 7.057 9.375 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.5c0-.851-.069-1.668-.218-2.5H12v4.5h6.458c-.274 1.465-1.107 2.708-2.371 3.538l3.027 2.342c1.733-1.602 2.886-3.954 2.886-7.38z"
              />
              <path
                fill="#FBBC05"
                d="M6.245 14.828l-3.034 2.347C4.89 19.888 8.134 22 12 22c2.777 0 5.2-.966 7.147-2.7l-3.027-2.342c-.856.572-1.942.942-3.24 1.017-.693.04-1.364.025-2.88-.025-1.743-.058-2.855-.904-3.755-3.122z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.777 0 5.2-.966 7.147-2.7l-3.027-2.342c-.856.572-1.942.942-3.24 1.017-.693.04-1.364.025-2.88-.025C8.257 17.892 7.145 17.046 6.245 14.828L3.211 17.175C4.89 19.888 8.134 22 12 22z"
              />
            </svg>
            Se connecter avec Google
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              S'inscrire
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}