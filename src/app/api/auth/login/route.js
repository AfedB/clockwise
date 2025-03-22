import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Importez le client déjà configuré
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Connexion avec Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Gestion des erreurs d'authentification
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    const { session, user } = data;

    // Création de la réponse
    const response = NextResponse.json({ 
      message: 'Connexion réussie',
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.user_metadata?.name || '' 
      }
    });
    
    // Définition du cookie de session Supabase
    response.cookies.set({
      name: 'sb-auth-token',
      value: session.access_token,
      httpOnly: true,
      maxAge: session.expires_in, // Durée de validité du token
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}