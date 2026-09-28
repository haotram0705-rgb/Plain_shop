import Link from 'next/link';
import { mobileTabs } from '@/config/mobile-tabs';

export function MobileTabBar() {
  const icons = ['⌂', '⌕', '▢', '✦'];
  return <nav className="mobile-tabbar" aria-label="Điều hướng di động">
    {mobileTabs.map((tab, index) => <Link key={tab.href} href={tab.href}><span>{icons[index]}</span>{tab.label}</Link>)}
  </nav>;
}
