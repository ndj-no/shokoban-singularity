# sokoban-enhanced

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Docker

### Build image

```sh
docker build -t sokoban-enhanced:latest .
```

### Run container

```sh
docker run -d --name sokoban -p 8080:80 sokoban-enhanced:latest
```

Truy cập: http://localhost:8080

### Healthcheck

```sh
curl http://localhost:8080/healthz
```

### Production Suggestions
- Thêm reverse proxy (Caddy/Traefik) để bật HTTPS.
- Dùng `--pull=always` trong CI khi build để cập nhật base image.
- Có thể thêm biến môi trường compile-time bằng cách khai báo trong `import.meta.env` và file `.env` rồi build lại image.

