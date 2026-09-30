# Triển khai

## GitHub Pages — website Plant Shop

GitHub Actions build app Vite tại `apps/legacy-vite/`; app này dùng lại giao diện storefront mới từ `apps/web` và chạy dạng SPA tĩnh. Push lên `main` sẽ tự build và deploy qua `.github/workflows/deploy.yml`.

- URL của website: `https://haotram0705-rgb.github.io/Plain_shop/`
- URL trên có phần `/Plain_shop/` vì đây là GitHub Pages project site của repository `Plain_shop`.
- URL gốc `https://haotram0705-rgb.github.io/` là account site riêng; repo hiện tại không deploy ở đó.
- Workflow copy `dist/index.html` thành `dist/404.html` để các route của SPA tiếp tục mở được khi tải lại trang.

Không cần Vercel, Node.js server hay database để hiển thị trang chủ, nội dung, catalog tĩnh và giỏ hàng lưu trong trình duyệt.

## Tính năng cần backend công khai

GitHub Pages chỉ host file tĩnh. Không có Next.js middleware, API route hoặc API NestJS tự chạy trong deployment này.

- Catalog và thông tin sản phẩm mẫu, điều hướng, bộ lọc, yêu thích/so sánh và giỏ hàng trên trình duyệt vẫn dùng được.
- Đăng nhập, tài khoản khách hàng và quản trị bị ẩn khỏi bản static; kiểm tra quyền chỉ ở trình duyệt không an toàn.
- Gửi đơn, gửi yêu cầu tư vấn, báo giá và upload cần deploy `apps/api` cùng PostgreSQL lên host Node.js có HTTPS công khai.
- Khi API sẵn sàng, thêm repository **Actions variable** tên `VITE_API_URL` với origin API (ví dụ `https://api.example.com`, không có `/` cuối), rồi chạy lại workflow/push commit mới.
- Cấu hình `WEB_ORIGIN=https://haotram0705-rgb.github.io` trong API để cho phép CORS từ GitHub Pages. `WEB_ORIGIN` chỉ là origin, không thêm `/Plain_shop/`.
- Không đặt mật khẩu, database URL, SMTP credentials hoặc secret trong biến `VITE_*`; các giá trị `VITE_*` được nhúng vào JavaScript công khai.
- Nếu không cấu hình `VITE_API_URL`, các biểu mẫu báo rằng chức năng gửi online chưa được kết nối thay vì báo thành công giả.

Lưu trữ `/uploads` cần volume bền vững hoặc object storage; filesystem tạm của host API không phù hợp để giữ media lâu dài.

## Kiểm tra và publish

```bash
npm --prefix apps/legacy-vite test
npm --prefix apps/legacy-vite run build
```

Sau khi build xong, workflow deploy trên push `main`. Theo dõi trạng thái tại GitHub repository → **Actions**. Khi workflow hoàn tất, mở `https://haotram0705-rgb.github.io/Plain_shop/`.

## Ứng dụng Next.js và POS quản trị

`apps/web` là ứng dụng Next.js 14 có middleware và route API đăng nhập; GitHub Pages không chạy được runtime này. Để sử dụng trang quản trị/POS:

- Deploy `apps/web` lên host hỗ trợ Next.js/Node.js; deploy `apps/api` và PostgreSQL riêng.
- Cấu hình `API_URL` cho Next server để proxy xác thực sang `apps/api`.
- Cấu hình `AUTH_SECRET` giống hệt giữa `apps/web` và `apps/api`, tối thiểu 32 ký tự ngẫu nhiên; chỉ đặt ở server environment, không commit.
- `apps/web/.env.example` liệt kê các biến local mẫu. Không dùng tài khoản admin hardcode hoặc `localStorage` làm cơ chế phân quyền.
- POS chỉ hiển thị sau khi Next xác minh cookie phiên HttpOnly có chữ ký hợp lệ và role nhân viên được cho phép (`OWNER`, `SALES`, `EDITOR`). Middleware chuyển người chưa đăng nhập về `/dang-nhap?next=/admin/...`.
