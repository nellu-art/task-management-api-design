export type Environment = 'development' | 'production' | 'test';

function getEnvironment(): Environment {
  const env = (process.env.NODE_ENV || 'development').toLowerCase();

  if (env === 'production' || env === 'prod') {
    return 'production';
  }
  if (env === 'test') {
    return 'test';
  }
  return 'development';
}

const currentEnv = getEnvironment();

export const appConfig = {
  // Environment
  env: currentEnv,
  isDevelopment: currentEnv === 'development',
  isProduction: currentEnv === 'production',
  isTest: currentEnv === 'test',

  // Server
  port: parseInt(process.env.PORT || '3000', 10),

  // Error Handling
  showErrorStack: !(currentEnv === 'production'),
};
