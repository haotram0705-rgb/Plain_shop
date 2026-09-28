 'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminMenu } from '@/config/admin-menu';

export function AdminSidebar() {
  const pathname = usePathname();
  return <aside className="admin-sidebar"><Link className="admin-brand" href="/admin"><span>PS</span><div>Plant Shop<small>STUDIO / ADMIN</small></div></Link><div className="admin-menu-label">Không gian làm việc</div><nav>{adminMenu.map((item, index) => <Link className={pathname === item.href ? 'active' : ''} href={item.href} key={item.href}><span className="menu-icon">{['⌂', '◈', '▦', '▤', '◇', '✦', '◌', '⌁', '▱', '≡', '▧', '▤', '♧', '◒', '⌁', '⚙', '♙', '◫'][index]}</span>{item.label}</Link>)}</nav><div className="admin-profile"><span>LN</span><div><strong>Lan Nguyễn</strong><small>Quản trị viên</small></div><b>⋮</b></div></aside>;
}
