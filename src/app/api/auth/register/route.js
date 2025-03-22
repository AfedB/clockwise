import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Utilisez le client préconfiguré

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Inscription de l'utilisateur avec Supabase Auth
    // Note: la méthode admin.createUser nécessite une clé de service
    // Si vous n'utilisez pas la clé admin dans lib/supabase.js, utilisez signUp à la place
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      }
    });

    if (error) {
      // Gestion des erreurs spécifiques
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Email déjà utilisé' },
          { status: 400 }
        );
      }
      
      throw error;
    }

    // Ne pas inclure de données sensibles dans la réponse
    const { user } = data;
    
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}