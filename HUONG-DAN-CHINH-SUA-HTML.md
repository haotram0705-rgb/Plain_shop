# Hướng dẫn chỉnh website GreenNest

Website đã được hợp nhất thành một bố cục React duy nhất trong `src/App.jsx` và `src/styles.css`. Các nhóm sản phẩm dùng chung `CatalogPage`, nên cây cảnh, chậu & vật tư và hoa & quà tặng đều hiển thị cùng cấu trúc: ảnh, giá, tồn kho, thông tin và nút thêm giỏ.

## Các route chính

- `/`: trang chủ
- `/cua-hang`: toàn bộ cửa hàng
- `/cay-canh`: nhóm cây cảnh
- `/chau-vat-tu`: nhóm chậu & vật tư
- `/hoa-qua-tang`: nhóm hoa & quà tặng
- `/san-pham/[slug]`: chi tiết sản phẩm
- `/gio-hang`, `/dat-hang`: giỏ hàng và đặt hàng
- `/dich-vu`, `/thu-vien`, `/bai-viet`, `/gioi-thieu`, `/lien-he`: nội dung dùng chung bố cục

## Album ảnh quản trị

Album không còn là trang public. Sau khi đăng nhập tài khoản admin, mở `/admin.html` và chọn **Quản lý album ảnh**, hoặc vào `/admin-album.html`.

Ảnh được lưu tạm trong `localStorage` với khóa `greennest-album-images`. Đây là lưu cục bộ theo trình duyệt, chưa phải upload server. Khi triển khai thật, thay phần này bằng API media và phân quyền ở backend.

## Chạy thử

```bash
npm run dev
```

Sau đó mở `/`, `/cua-hang`, `/cay-canh`, `/thu-vien` hoặc `/admin.html`.
