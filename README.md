# Plant Shop Monorepo

Website cây cảnh gồm storefront, trang quản trị và API commerce.

## Công nghệ

- `apps/legacy-vite`: website React/Vite tĩnh hiện được deploy lên GitHub Pages; dùng lại UI storefront từ `apps/web`
- `apps/web`: Next.js 14 App Router, giữ các tính năng cần runtime server
- `apps/api`: NestJS 10, Prisma 5, PostgreSQL
- `packages/contracts`: kiểu dữ liệu dùng chung
- `infra`: cấu hình Docker cho môi trường phát triển

## Yêu cầu

- Node.js 20.17 trở lên
- pnpm 9.15.4
- PostgreSQL 15 trở lên khi chạy API

## Cài đặt và phát triển

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
```

Thay các giá trị mẫu bằng cấu hình local. Không commit file `.env`.

```bash
pnpm dev:web   # Next.js server tại http://localhost:3000
pnpm dev:api   # NestJS API tại http://localhost:3001
pnpm dev:vite  # Bản static storefront tại http://localhost:5173
```

## Database

```bash
pnpm --dir apps/api db:deploy
pnpm --dir apps/api db:seed
```

Migration ở `apps/api/prisma/migrations`; dữ liệu seed chỉ dành cho môi trường phát triển.

## Deploy website đơn giản lên GitHub

1. Push lên nhánh `main`.
2. GitHub Actions tự build Vite và deploy giao diện Plant Shop mới lên [https://haotram0705-rgb.github.io/Plain_shop/](https://haotram0705-rgb.github.io/Plain_shop/).
3. Kiểm tra workflow trong tab **Actions** của repo.

Không cần tự chạy build trước khi push; workflow trong `.github/workflows/deploy.yml` sẽ build và publish. Chi tiết API/backend tùy chọn ở [docs/deployment.md](./docs/deployment.md).

## Kiểm tra local

```bash
npm --prefix apps/legacy-vite test
npm --prefix apps/legacy-vite run build
pnpm build:web
pnpm build:api
```

Không đưa `.env`, token, mật khẩu, database hoặc dữ liệu production vào repository.
