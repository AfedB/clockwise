import { supabase } from './supabase';

// Cette fonction n'est plus nécessaire avec Supabase
// Supabase gère le hachage des mots de passe en interne
export const hashPassword = async (password) => {
  console.warn('hashPassword est obsolète avec Supabase Auth');
  return password;
};

// Cette fonction n'est plus nécessaire avec Supabase
export const comparePasswords = async (password, hashedPassword) => {
  console.warn('comparePasswords est obsolète avec Supabase Auth');
  return false;
};

// Génère un token JWT via Supabase
export const generateToken = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data.session.access_token;
};

// Vérifie un token JWT via Supabase
export const verifyToken = async (token) => {
  try {
    // Création d'un client avec le token fourni
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) return null;
    return data.user;
  } catch (error) {
    return null;
  }
};

// Fonction utilitaire pour obtenir l'utilisateur actuel
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) return null;
  return data.user;
};

// Fonction utilitaire pour obtenir la session actuelle
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) return null;
  return data.session;
};