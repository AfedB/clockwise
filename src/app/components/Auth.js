// components/Auth.js
import React from 'react'
import { supabase } from '../../lib/supabase'

export default function Auth() {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Erreur de connexion:', error.message)
    }
  }

  return (
    <div className="auth-container">
      <h1>Connexion</h1>
      <button onClick={handleGoogleLogin} className="google-btn">
        Se connecter avec Google
      </button>
    </div>
  )
}