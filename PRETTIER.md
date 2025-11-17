# Prettier 配置说明

本项目已配置 Prettier 用于代码格式化，并与 ESLint 集成以避免冲突。

## 配置文件

- `.prettierrc` - Prettier 主配置文件
- `.prettierignore` - 忽略格式化的文件/目录列表

## 配置选项

当前 Prettier 配置：

- **semi**: `true` - 使用分号
- **trailingComma**: `"es5"` - 在 ES5 兼容的地方添加尾随逗号
- **singleQuote**: `false` - 使用双引号
- **printWidth**: `80` - 每行最大字符数
- **tabWidth**: `2` - 缩进空格数
- **useTabs**: `false` - 使用空格而非 Tab
- **arrowParens**: `"always"` - 箭头函数参数始终使用括号
- **endOfLine**: `"lf"` - 使用 LF 换行符
- **bracketSpacing**: `true` - 对象字面量的大括号间有空格
- **jsxSingleQuote**: `false` - JSX 中使用双引号
- **bracketSameLine**: `false` - 将多行 HTML/JSX 元素的 `>` 放在新行

## 使用方法

### 格式化所有文件

```bash
pnpm format
```

### 检查格式化（不修改文件）

```bash
pnpm format:check
```

### 格式化特定文件

```bash
npx prettier --write path/to/file.ts
```

### 检查特定文件

```bash
npx prettier --check path/to/file.ts
```

## 与 ESLint 集成

项目已配置 `eslint-config-prettier`，它会：

1. 关闭所有与 Prettier 冲突的 ESLint 规则
2. 确保 ESLint 和 Prettier 可以和谐共存

## IDE 集成

### VS Code

安装 Prettier 扩展后，可以配置保存时自动格式化：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 其他 IDE

请参考 Prettier 官方文档配置相应的 IDE 插件。

## 忽略的文件

以下文件/目录会被 Prettier 忽略（见 `.prettierignore`）：

- `node_modules`
- `dist`, `.vite`, `build`, `out`
- 日志文件
- 锁文件
- 环境变量文件
- SVG 文件
- 配置文件（如 `vite.config.ts`, `tailwind.config.js` 等）

## 注意事项

1. **提交前格式化**：建议在提交代码前运行 `pnpm format` 确保代码格式一致
2. **CI/CD**：可以在 CI 流程中添加 `pnpm format:check` 来检查代码格式
3. **团队协作**：确保团队成员都使用相同的 Prettier 配置

