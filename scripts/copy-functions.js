#!/usr/bin/env node

/**
 * 复制 functions/ 目录到 dist/functions/
 * 用于 Cloudflare Pages Functions 部署
 */

import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join } from 'path';

const srcDir = 'functions';
const destDir = 'dist/functions';

function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);

    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

if (existsSync(srcDir)) {
  console.log(`Copying ${srcDir} to ${destDir}...`);
  copyDir(srcDir, destDir);
  console.log('Functions copied successfully!');
} else {
  console.warn(`Warning: ${srcDir} directory not found. Skipping copy.`);
}









