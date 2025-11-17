// 环境变量工具函数

/**
 * 获取环境变量值（带类型转换）
 */
export function getEnv(key: string, defaultValue?: string): string {
  return (import.meta.env[key as keyof ImportMetaEnv] as string) || defaultValue || '';
}

/**
 * 获取布尔类型的环境变量
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key as keyof ImportMetaEnv] as string | undefined;
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * 获取数字类型的环境变量
 */
export function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key as keyof ImportMetaEnv] as string | undefined;
  if (value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 验证必需的环境变量
 */
export function validateEnv(): void {
  const required: string[] = [];
  const missing: string[] = [];
  
  // 非开发环境需要 API_BASE_URL
  if (!import.meta.env.DEV) {
    required.push('VITE_API_BASE_URL');
  }
  
  required.forEach(key => {
    if (!import.meta.env[key as keyof ImportMetaEnv]) {
      missing.push(key);
    }
  });
  
  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(error);
    if (!import.meta.env.DEV) {
      throw new Error(error);
    }
  }
}

/**
 * 获取应用配置
 */
export const appConfig = {
  name: getEnv('VITE_APP_NAME', 'Mutopia Pet'),
  version: getEnv('VITE_APP_VERSION', '1.0.0'),
  env: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

/**
 * 获取功能开关配置
 */
export const featureFlags = {
  guestMode: getEnvBoolean('VITE_ENABLE_GUEST_MODE', true),
  socialLogin: getEnvBoolean('VITE_ENABLE_SOCIAL_LOGIN', true),
  payment: getEnvBoolean('VITE_ENABLE_PAYMENT', true),
  review: getEnvBoolean('VITE_ENABLE_REVIEW', true),
} as const;

/**
 * 获取第三方服务配置
 */
export const thirdPartyConfig = {
  stripePublicKey: getEnv('VITE_STRIPE_PUBLIC_KEY'),
  googleClientId: getEnv('VITE_GOOGLE_CLIENT_ID'),
  facebookAppId: getEnv('VITE_FACEBOOK_APP_ID'),
} as const;

/**
 * 获取性能配置
 */
export const performanceConfig = {
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  apiRetry: getEnvNumber('VITE_API_RETRY', 0),
  apiRetryDelay: getEnvNumber('VITE_API_RETRY_DELAY', 1000),
} as const;

