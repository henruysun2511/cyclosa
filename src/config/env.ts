const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  API_BASE_URL: getEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:3001/api"),
  APP_NAME: getEnv("NEXT_PUBLIC_APP_NAME", "My App"),
} as const;
