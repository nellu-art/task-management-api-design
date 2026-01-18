import { registerAs } from '@nestjs/config';
import { ConfigType } from '@nestjs/config';

export type Environment = 'development' | 'production' | 'test';

export type AppConfig = {
  env: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  port: number;
  showErrorStack: boolean;
};

const parseEnvironment = (): Environment => {
  const env = (process.env.NODE_ENV || 'development').toLowerCase().trim();
  if (env === 'prod' || env === 'production') return 'production';
  if (env === 'test') return 'test';
  return 'development';
};

const parsePort = (): number => {
  const portStr = process.env.PORT || '3000';
  const port = parseInt(portStr, 10);

  if (isNaN(port) || port < 1 || port > 65535) {
    // Log warning - config factories run before Logger is available
    // This will be caught by Joi validation, but keeping as fallback
    if (process.env.PORT) {
      console.warn(
        `[Config] Invalid PORT "${process.env.PORT}", using default 3000`,
      );
    }
    return 3000;
  }

  return port;
};

export const appConfigFactory = registerAs('app', (): AppConfig => {
  const env = parseEnvironment();
  const port = parsePort();

  return {
    env,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isTest: env === 'test',
    port,
    showErrorStack: env !== 'production',
  };
});

/**
 * Type helper for injecting app configuration with full type safety.
 * Usage: constructor(@Inject(appConfigFactory.KEY) config: AppConfigType)
 */
export type AppConfigType = ConfigType<typeof appConfigFactory>;
