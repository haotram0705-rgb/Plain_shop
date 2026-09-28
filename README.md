# Plant Shop Monorepo

Website bán cây cảnh, vật tư và dịch vụ chăm sóc cây, gồm storefront, trang quản trị và API commerce.

## Công nghệ

- `apps/web`: Next.js 14, React 18, TypeScript
- `apps/api`: NestJS 10, Prisma 5, PostgreSQL
- `packages/contracts`: kiểu dữ liệu dùng chung
- `infra`: cấu hình Docker cho môi trường phát triển

## Yêu cầu

- Node.js 20.17 trở lên
- pnpm 9.15.4
- PostgreSQL 15 trở lên khi chạy API

## Cài đặt

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
```

Thay toàn bộ giá trị mẫu trong file `.env` bằng cấu hình thật. Không commit các file này lên GitHub.

## Khởi động

```bash
pnpm dev:web
pnpm dev:api
```

Frontend: `http://localhost:3000`
API: `http://localhost:3001/api`
PostgreSQL mặc định: `localhost:5432`

## Database

```bash
pnpm --dir apps/api db:deploy
pnpm --dir apps/api db:seed
```

Migration nằm tại `apps/api/prisma/migrations`. Dữ liệu seed chỉ phù hợp cho môi trường phát triển.

## Kiểm tra trước khi phát hành

```bash
pnpm lint
pnpm build:web
pnpm build:api
```

## Cấu trúc

- `apps/web/src/app`: storefront và trang quản trị
- `apps/web/src/components`: component dùng chung
- `apps/api/src/modules`: các module nghiệp vụ
- `apps/api/prisma`: schema, migration và seed
- `docs`: tài liệu hệ thống
- `infra`: Docker và hạ tầng

## Triển khai GitHub

1. Kiểm tra lại bằng `pnpm lint` và hai lệnh build.
2. Chỉ thêm file mã nguồn và file cấu hình không nhạy cảm.
3. Không đưa `.env`, token, khóa API, database, thư mục upload hoặc file IDE vào repository.
4. Nếu từng commit bí mật, xoay vòng/đổi bí mật trước khi công khai repository.
