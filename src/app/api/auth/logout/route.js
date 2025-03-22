import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Utilisez le client préconfiguré
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Récupérer le cookie de session
    const cookieStore = cookies();
    const supabaseAuthToken = cookieStore.get('sb-auth-token')?.value;
    
    // Déconnecter l'utilisateur dans Supabase
    await supabase.auth.signOut();
    
    // Créer la réponse
    const response = NextResponse.json({ message: 'Déconnexion réussie' });
    
    // Supprimer le cookie de session
    response.cookies.set({
      name: 'sb-auth-token',
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    
    // Supprimer également l'ancien cookie auth_token pour la compatibilité
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}