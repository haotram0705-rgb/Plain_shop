# Triển khai

Repository chứa ba ứng dụng có quy trình triển khai riêng:

| Ứng dụng | Nền tảng | URL / đường dẫn |
| --- | --- | --- |
| `apps/legacy-vite` (bản storefront cũ) | GitHub Pages qua `.github/workflows/deploy.yml` | `https://haotram0705-rgb.github.io/Plain_shop/` |
| `apps/web` (Next.js 14, storefront hiện hành) | Vercel | URL `.vercel.app` do Vercel cấp, hoặc domain riêng đã xác minh |
| `apps/api` (NestJS) | Node.js host riêng | URL API công khai cần cấu hình trong `NEXT_PUBLIC_API_URL` |

GitHub Pages chỉ phục vụ bản Vite tĩnh trong workflow hiện tại. `apps/web` dùng middleware và route handler đăng nhập ở server nên cần runtime Next.js; không đổi workflow Pages sang build static cho app này.

## Deploy `apps/web` lên Vercel

1. Import repository `haotram0705-rgb/Plain_shop` vào Vercel và tạo project riêng cho Next.js.
2. Trong **Build and Deployment** đặt **Root Directory** là `apps/web`; framework là **Next.js**. Giữ lệnh install/build/output mặc định do Vercel nhận diện Next.js và pnpm workspace. Repository dùng `pnpm-lock.yaml` ở root.
3. Nếu Vercel hỏi về file ngoài Root Directory, bật **Include source files outside the Root Directory in the Build Step** để pnpm workspace có thể đọc cấu hình và lockfile ở root.
4. Thêm các biến môi trường sau cho Production (và Preview nếu cần):

   | Biến | Giá trị |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | URL production Vercel của app, ví dụ `https://<project>.vercel.app` |
   | `NEXT_PUBLIC_API_URL` | URL HTTPS công khai của `apps/api`, không có dấu `/` ở cuối |
   | `ADMIN_EMAIL` | Email quản trị production |
   | `ADMIN_PASSWORD` | Mật khẩu quản trị mạnh, riêng cho production |

   Không dùng giá trị localhost hoặc tài khoản mẫu trong production. Chỉ lưu thông tin nhạy cảm trong **Vercel Environment Variables**, không commit vào repository.
5. Deploy. Mỗi lần push lên `main`, Vercel sẽ tạo deployment mới cho `apps/web`. GitHub Actions hiện tại vẫn deploy `apps/legacy-vite` lên Pages như trước.

## API và CORS

Vercel chỉ host `apps/web`; API NestJS và PostgreSQL chưa được deploy bởi workflow GitHub Pages này. Để đặt hàng, tải ảnh dịch vụ và gửi yêu cầu tư vấn hoạt động trên production:

- Deploy `apps/api` cùng PostgreSQL lên một host hỗ trợ Node.js và cấu hình migrations/secrets theo `apps/api/.env.example`.
- Đặt `NEXT_PUBLIC_API_URL` thành URL công khai của API trong Vercel, rồi redeploy frontend.
- Đặt `WEB_ORIGIN` bên API thành origin của app Vercel (ví dụ `https://<project>.vercel.app`). Với custom domain, thêm origin đó vào danh sách cho phép CORS.
- Lưu trữ `/uploads` bằng volume bền vững hoặc object storage; filesystem tạm của host không phù hợp để giữ media lâu dài.

Đăng nhập admin của Next.js kiểm tra `ADMIN_EMAIL` và `ADMIN_PASSWORD` trong Vercel, rồi tạo cookie phiên bằng route handler `/api/auth/login`.

## GitHub Pages và domain

- `https://haotram0705-rgb.github.io/Plain_shop/` là project site của repository `Plain_shop` và tiếp tục hiển thị app Vite cũ.
- `https://haotram0705-rgb.github.io/` là URL account site riêng; nó không tự động trỏ sang repository `Plain_shop` hoặc deployment trên Vercel.
- Không thể chuyển hostname `github.io` sang Vercel như một custom domain. Để dùng domain riêng trên Vercel, cần sở hữu domain đó và cấu hình DNS theo hướng dẫn Vercel.

## Kiểm tra trước khi phát hành

```bash
pnpm build:web
pnpm build:api
npm --prefix apps/legacy-vite run build
```

Không commit `.env`, mật khẩu, token, thông tin database hoặc dữ liệu production.
