import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export const logInfo = (message, data = {}) => {
  logger.info({ ...data }, message);
};

export const logError = (message, error = null, data = {}) => {
  logger.error({ error, ...data }, message);
};

export const logWarn = (message, data = {}) => {
  logger.warn({ ...data }, message);
};

export const logDebug = (message, data = {}) => {
  logger.debug({ ...data }, message);
};

export default logger; 