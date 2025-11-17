/// <reference types="vite/client" />

// 环境变量类型定义
interface ImportMetaEnv {
  // API 配置
  readonly VITE_API_BASE_URL?: string;
  
  // 开发调试配置
  readonly VITE_DEBUG?: string;
  
  // 应用配置
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  
  // 功能开关
  readonly VITE_ENABLE_GUEST_MODE?: string;
  readonly VITE_ENABLE_SOCIAL_LOGIN?: string;
  readonly VITE_ENABLE_PAYMENT?: string;
  readonly VITE_ENABLE_REVIEW?: string;
  
  // 第三方服务配置
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_FACEBOOK_APP_ID?: string;
  
  // 性能配置
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_API_RETRY?: string;
  readonly VITE_API_RETRY_DELAY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// SVG 模块声明
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

