# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

````js
export default defineConfig([
  # Mezgeb Frontend

  The frontend is a React, TypeScript, and Vite application. It is being built as a
  learning project, so dependencies and abstractions are introduced as their use
  cases arrive.

  ## Development

  ```sh
  npm install
  npm run dev
````

Copy `.env.example` to `.env.local` to customize the public Vite configuration.
Only `VITE_*` variables are exposed to browser code; never put secrets in them.

## Checks

```sh
npm run typecheck
npm run lint
npm run format:check
npm run test -- --run
npm run build
```

The route screens are placeholders. Authentication, API access, and product
features have not been implemented yet.
