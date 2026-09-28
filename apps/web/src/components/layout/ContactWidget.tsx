'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type ContactSettings = { zalo: string; whatsapp: string; email: string; hotline: string; facebook: string; tiktok: string; enabled: Record<string, boolean> };
const defaults: ContactSettings = { zalo: '0909123456', whatsapp: '84909123456', email: 'hello@plantshop.vn', hotline: '0909123456', facebook: 'https://www.facebook.com', tiktok: 'https://www.tiktok.com', enabled: { zalo: true, whatsapp: true, email: true, hotline: true, facebook: true, tiktok: true } };

export function ContactWidget() {
  const [settings, setSettings] = useState(defaults);
  const isHomePage = usePathname() === '/';
  useEffect(() => { const saved = window.localStorage.getItem('plant_shop_contact_settings'); if (saved) setSettings({ ...defaults, ...JSON.parse(saved) }); }, []);
  const query = typeof window === 'undefined' ? '' : `?url=${encodeURIComponent(window.location.href)}`;
  const channels = [settings.enabled.zalo && { className: 'social-zalo', href: `https://zalo.me/${settings.zalo}`, label: 'Chat Zalo', text: 'Zalo' }, settings.enabled.whatsapp && { className: 'social-whatsapp', href: `https://wa.me/${settings.whatsapp}`, label: 'Chat WhatsApp', text: 'WA' }, settings.enabled.facebook && { className: 'social-facebook', href: settings.facebook, label: 'Facebook', text: 'f' }, settings.enabled.tiktok && { className: 'social-tiktok', href: settings.tiktok, label: 'TikTok', text: '♪' }].filter(Boolean) as { className: string; href: string; label: string; text: string }[];
  return <><div className={`social-float${isHomePage ? ' social-float-home' : ''}`} aria-label="Kết nối mạng xã hội">{channels.map((channel) => <a className={`social-bubble ${channel.className}`} href={channel.href} target="_blank" rel="noreferrer" aria-label={channel.label} title={channel.label} key={channel.label}><span>{channel.text}</span></a>)}</div><Link className={`contact-widget${isHomePage ? ' contact-widget-home' : ''}`} href={`/lien-he${query}`} aria-label="Liên hệ tư vấn"><span>✦</span><strong>Cần tư vấn?</strong><small>Nhắn Plant Shop</small></Link></>;
}
