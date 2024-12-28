interface EnvConfig {
  apiUrl: string;
  isDev: boolean;
  isProd: boolean;
}

export const getEnvConfig = (): EnvConfig => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.error('VITE_API_URL environment variable is not set');
    throw new Error('API URL not configured');
  }

  // Remove trailing slash if present
  const normalizedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

  return {
    apiUrl: normalizedApiUrl,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD
  };
};
