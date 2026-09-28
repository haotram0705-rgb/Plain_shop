 'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function AdminHeader() {
  const [now, setNow] = useState(new Date());
  const [isClockReady, setIsClockReady] = useState(false);
  useEffect(() => { setIsClockReady(true); const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  const dateText = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(now).toUpperCase();
  const timeText = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  return <header className="admin-header"><div><span className="admin-kicker">{isClockReady ? `${dateText} · ${timeText}` : 'ĐANG TẢI GIỜ VIỆT NAM'}</span><h1>Chào buổi sáng, Lan <span>✦</span></h1></div><div className="admin-header-actions"><button aria-label="Tìm kiếm">⌕</button><button aria-label="Thông báo">♢<i /></button><Link className="admin-site-link" href="/" aria-label="Xem website">↗</Link></div></header>;
}
