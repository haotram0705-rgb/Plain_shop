# Cơ sở dữ liệu

Prisma schema nằm ở `apps/api/prisma/schema.prisma`.

## Khởi động PostgreSQL

Từ thư mục gốc:

```powershell
docker compose -f infra/docker/docker-compose.yml up -d postgres
```

Sao chép `apps/api/.env.example` thành `apps/api/.env`, sau đó chạy:

```powershell
npm.cmd run db:migrate --workspace @plant-shop/api
npm.cmd run db:seed --workspace @plant-shop/api
```

Nếu PostgreSQL chưa chạy, migration sẽ báo lỗi Prisma `P1001` tại `localhost:5432`.
