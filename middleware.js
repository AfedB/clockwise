import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cette fonction crée un nouveau client Supabase pour le middleware
// Le middleware ne peut pas partager le client défini dans lib/supabase.js
function createSupabaseForMiddleware(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  // Récupérer le cookie de session Supabase
  const authToken = request.cookies.get('sb-auth-token')?.value;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      headers: authToken ? {
        Authorization: `Bearer ${authToken}`
      } : undefined
    }
  });
}

export async function middleware(request) {
  // Vérifier si le chemin commence par /dashboard ou d'autres routes protégées
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile')
  ) {
    // Créer un client Supabase pour vérifier l'authentification
    const supabase = createSupabaseForMiddleware(request);
    
    if (!supabase) {
      // Erreur de configuration, rediriger vers la page de connexion
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Vérifier si l'utilisateur est authentifié
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Rediriger vers la page de connexion
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure les chemins sur lesquels le middleware s'applique
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};