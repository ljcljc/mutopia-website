/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// 支持 SVG 作为 URL 导入（默认行为）
declare module "*.svg" {
  const content: string;
  export default content;
}
