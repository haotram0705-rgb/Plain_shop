import './globals.css';
import './overrides.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plant Shop',
  description: 'Cửa hàng cây cảnh, chậu vật tư và dịch vụ chăm sóc cây',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
