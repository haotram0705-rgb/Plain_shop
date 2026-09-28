'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) router.push(`/cua-hang?q=${encodeURIComponent(value)}`);
    setIsOpen(false);
  }

  return <>
    <button className="icon-button search-trigger" type="button" aria-label="Tìm kiếm" aria-expanded={isOpen} onClick={() => setIsOpen(true)}>⌕ <span>Tìm kiếm</span></button>
    {isOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Tìm kiếm sản phẩm"><button className="search-backdrop" type="button" aria-label="Đóng tìm kiếm" onClick={() => setIsOpen(false)} /><form className="search-dialog" onSubmit={handleSubmit}><span className="eyebrow">Tìm cây cho không gian của bạn</span><h2>Bạn đang tìm<br /><em>một mảng xanh?</em></h2><div className="search-field"><span>⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên cây, chậu, vật tư..." /><button type="submit">Tìm ngay</button></div><button className="search-close" type="button" onClick={() => setIsOpen(false)}>Đóng tìm kiếm</button></form></div>}
  </>;
}
