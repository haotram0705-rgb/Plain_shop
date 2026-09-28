export const navigation = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  {
    label: 'Sản phẩm',
    href: '/cay-canh',
    children: [
      { label: 'Cây cảnh', href: '/cay-canh' },
      { label: 'Chậu và vật tư', href: '/chau-vat-tu' },
      { label: 'Hoa và quà tặng', href: '/hoa-qua-tang' },
    ],
    megaSections: [
      {
        title: 'Cây cảnh', href: '/cay-canh',
        items: [
          { label: 'Cây xanh', href: '/cay-canh' },
          { label: 'Cây văn phòng', href: '/cay-canh' },
          { label: 'Cây nhỏ trang trí', href: '/cay-canh' },
          { label: 'Cây mix văn phòng', href: '/cay-canh' },
          { label: 'Cây mix quà biếu', href: '/cay-canh' },
          { label: 'Bonsai', href: '/cay-canh' },
          { label: 'Vườn cây & video', href: '/thu-vien' },
        ],
      },
      {
        title: 'Chậu & vật tư', href: '/chau-vat-tu',
        items: [
          { label: 'Chậu cây', href: '/chau-vat-tu' },
          { label: 'Đất trồng', href: '/chau-vat-tu' },
          { label: 'Phân bón', href: '/chau-vat-tu' },
          { label: 'Thuốc chăm sóc cây', href: '/chau-vat-tu' },
          { label: 'Dụng cụ & vật tư', href: '/chau-vat-tu' },
          { label: 'Phụ kiện ngành hoa', href: '/chau-vat-tu' },
          { label: 'Combo', href: '/chau-vat-tu' },
          { label: 'Thuốc bảo vệ thực vật', href: '/chau-vat-tu' },
          { label: 'Vật tư ngành hoa', href: '/chau-vat-tu' },
          { label: 'Chậu sứ · chậu nhựa', href: '/chau-vat-tu' },
          { label: 'Lưới đen & dụng cụ', href: '/chau-vat-tu' },
          { label: 'Phân lá · phân chuồng', href: '/chau-vat-tu' },
          { label: 'Tre · cây chống', href: '/chau-vat-tu' },
        ],
      },
      {
        title: 'Hoa & quà tặng', href: '/hoa-qua-tang',
        items: [
          { label: 'Lan hồ điệp', href: '/hoa-qua-tang' },
          { label: 'Chậu quà biếu đặc biệt', href: '/hoa-qua-tang' },
          { label: 'Điện hoa tươi', href: '/hoa-qua-tang' },
        ],
        note: 'Mẫu riêng? Gửi yêu cầu tư vấn.',
      },
    ],
  },
  {
    label: 'Dịch vụ',
    href: '/dich-vu',
    children: [
      { label: 'Tư vấn không gian', href: '/dich-vu#thiet-ke-canh-quan' },
      { label: 'Chăm sóc cây', href: '/dich-vu#cham-soc-canh-quan' },
      { label: 'Thi công cảnh quan', href: '/dich-vu#thiet-ke-canh-quan' },
      { label: 'Cho thuê cây xanh', href: '/dich-vu#thue-doi-cay' },
    ],
    megaSections: [
      {
        title: 'Tư vấn & thiết kế', href: '/dich-vu#thiet-ke-canh-quan',
        items: [
          { label: 'Tư vấn không gian', href: '/dich-vu#thiet-ke-canh-quan' },
          { label: 'Thiết kế góc xanh', href: '/dich-vu#thiet-ke-canh-quan' },
        ],
      },
      {
        title: 'Chăm sóc cây', href: '/dich-vu#cham-soc-canh-quan',
        items: [
          { label: 'Chăm cây định kỳ', href: '/dich-vu#cham-soc-canh-quan' },
          { label: 'Cứu cây tại nhà', href: '/dich-vu#cham-soc-canh-quan' },
        ],
      },
      {
        title: 'Thi công & cho thuê', href: '/dich-vu#thiet-ke-canh-quan',
        items: [
          { label: 'Thi công cảnh quan', href: '/dich-vu#thiet-ke-canh-quan' },
          { label: 'Cho thuê cây xanh', href: '/dich-vu#thue-doi-cay' },
          { label: 'Sân vườn · biệt thự', href: '/dich-vu#thiet-ke-canh-quan' },
          { label: 'Trường học · văn phòng', href: '/dich-vu#thiet-ke-canh-quan' },
        ],
        note: 'Gửi yêu cầu để nhận tư vấn riêng.',
      },
    ],
  },
  {
    label: 'Thư viện & câu chuyện',
    href: '/thu-vien',
    children: [
      { label: 'Bài viết chăm cây', href: '/bai-viet' },
      { label: 'Video & album vườn cây', href: '/thu-vien' },
      { label: 'Dự án đã thực hiện', href: '/du-an' },
      { label: 'Plant Shop trên truyền thông', href: '/truyen-thong' },
      { label: 'Đối tác & hoạt động', href: '/doi-tac' },
    ],
    megaSections: [
      {
        title: 'Đọc & học', href: '/bai-viet',
        items: [
          { label: 'Bài viết chăm cây', href: '/bai-viet' },
          { label: 'Video & album vườn cây', href: '/thu-vien' },
        ],
      },
      {
        title: 'Dự án & truyền thông', href: '/du-an',
        items: [
          { label: 'Dự án đã thực hiện', href: '/du-an' },
          { label: 'Truyền thông công ty', href: '/thu-vien#truyen-thong' },
        ],
      },
      {
        title: 'Cộng đồng', href: '/doi-tac',
        items: [
          { label: 'Đối tác & hoạt động', href: '/doi-tac' },
          { label: 'Liên hệ Plant Shop', href: '/lien-he' },
        ],
        note: 'Cùng lan tỏa một lối sống xanh.',
      },
    ],
  },
  { label: 'Cửa hàng', href: '/cua-hang' },
  { label: 'Liên hệ', href: '/lien-he' },
];
