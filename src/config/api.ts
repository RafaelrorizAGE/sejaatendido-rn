type EnvVars = {
  API_URL: string;
};

const ENV: Record<'dev' | 'staging' | 'production', EnvVars> = {
  dev: {
    API_URL: 'https://sejaatendido-backend.onrender.com',
  },
  staging: {
    API_URL: 'https://sejaatendido-backend.onrender.com',
  },
  production: {
    API_URL: 'https://sejaatendido-backend.onrender.com',
  },
};

const EXPO_PUBLIC_API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();

const getEnvVars = (): EnvVars => {
  if (EXPO_PUBLIC_API_URL) {
    return { API_URL: EXPO_PUBLIC_API_URL };
  }

  if (__DEV__) {
    return ENV.dev;
  }

  return ENV.production;
};

export const config = getEnvVars();
export const API_URL = config.API_URL;
