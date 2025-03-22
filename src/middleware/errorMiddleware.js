import { handleError } from '../utils/errorHandler';

export const errorMiddleware = (err, req, res, next) => {
  const error = handleError(err);

  // En développement, on envoie plus de détails
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode).json({
      ...error,
      stack: err.stack,
    });
  }

  // En production, on envoie uniquement les informations nécessaires
  return res.status(error.statusCode).json(error);
}; 