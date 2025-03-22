import { logError } from './logger';

export class AppError extends Error {
  constructor(message, statusCode = 500, data = {}) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = 'AppError';
  }
}

export const handleError = (error) => {
  // Log l'erreur
  logError('Une erreur est survenue', error, {
    stack: error.stack,
    name: error.name,
  });

  // Si c'est une AppError, on utilise ses propriétés
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
    };
  }

  // Pour les erreurs Supabase
  if (error.code?.startsWith('PGRST')) {
    return {
      message: 'Erreur de base de données',
      statusCode: 500,
      data: { code: error.code },
    };
  }

  // Pour les erreurs d'authentification
  if (error.message?.includes('auth')) {
    return {
      message: 'Erreur d\'authentification',
      statusCode: 401,
      data: { message: error.message },
    };
  }

  // Erreur par défaut
  return {
    message: 'Une erreur inattendue est survenue',
    statusCode: 500,
    data: { message: error.message },
  };
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 