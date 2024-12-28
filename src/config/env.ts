interface EnvConfig {
  apiUrl: string;
  isDev: boolean;
  isProd: boolean;
}

export const getEnvConfig = (): EnvConfig => {
  // Log all environment variables
  console.log('All env variables:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.error('VITE_API_URL environment variable is not set');
    throw new Error('API URL not configured');
  }

  // Remove trailing slash if present
  const normalizedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

  // Log the final config
  const config = {
    apiUrl: normalizedApiUrl,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD
  };
  
  console.log('Final environment config:', config);
  return config;
};
