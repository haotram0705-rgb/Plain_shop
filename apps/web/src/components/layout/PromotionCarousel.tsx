'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type PromotionSlide = {
  image: string;
  imageAlt?: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  enabled?: boolean;
};

const defaultSlides: PromotionSlide[] = [
  {
    image: 'https://images.pexels.com/photos/30431307/pexels-photo-30431307.jpeg',
    imageAlt: 'Tán lá dương xỉ xanh đậm, ảnh của Aleksandr Sochnev trên Pexels',
    eyebrow: 'Sự kiện tháng 9 · Vườn cây Việt',
    title: 'Cho trải nghiệm\nkhông chỉ là cây cảnh.',
    description: 'Ưu đãi đến 20% cho cây nội thất và chậu gốm thủ công trong tuần này.',
    cta: 'Xem ưu đãi',
    href: '/cua-hang',
  },
  {
    image: '/assets/images/cat-indoor.jpg',
    imageAlt: 'Cây xanh được sắp đặt trong không gian sống',
    eyebrow: 'Bộ sưu tập mới · Green corner',
    title: 'Một góc xanh\ncho mùa mới.',
    description: 'Tặng phí phối chậu cho đơn hàng từ 800.000đ trong thời gian có hạn.',
    cta: 'Khám phá bộ sưu tập',
    href: '/cay-canh',
  },
  {
    image: '/assets/images/cat-succulents.jpg',
    imageAlt: 'Những chậu cây nhỏ thích hợp làm quà tặng',
    eyebrow: 'Quà tặng xanh · Gửi điều tử tế',
    title: 'Trao một mầm xanh,\ngửi một lời thương.',
    description: 'Miễn phí thiệp viết tay và gói quà cho mọi đơn hoa, cây quà tặng.',
    cta: 'Chọn quà tặng',
    href: '/hoa-qua-tang',
  },
];

export function PromotionCarousel() {
  const [slides, setSlides] = useState<PromotionSlide[]>(defaultSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const visibleSlides = slides.filter((slide) => slide.enabled !== false);
  const currentSlide = visibleSlides[activeIndex] ?? defaultSlides[0];

  useEffect(() => {
    const savedSlides = window.localStorage.getItem('plant_shop_promotions');
    if (savedSlides) {
      try {
        const parsedSlides = JSON.parse(savedSlides) as PromotionSlide[];
        if (parsedSlides.length > 0) setSlides(parsedSlides);
      } catch {
        window.localStorage.removeItem('plant_shop_promotions');
      }
    }
  }, []);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(visibleSlides.length - 1, 0)));
  }, [visibleSlides.length]);

  useEffect(() => {
    if (isPaused || isHovering || isDragging || visibleSlides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % visibleSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused, isHovering, isDragging, visibleSlides.length]);

  const moveSlide = useCallback((direction: number) => {
    setActiveIndex((index) => (index + direction + visibleSlides.length) % visibleSlides.length);
  }, [visibleSlides.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') moveSlide(-1);
      if (event.key === 'ArrowRight') moveSlide(1);
      if (event.key === 'Escape') setIsPaused(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveSlide]);

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    if (dragStart.current !== null) {
      const distance = event.clientX - dragStart.current;
      if (Math.abs(distance) > 45) moveSlide(distance > 0 ? -1 : 1);
    }
    dragStart.current = null;
    setIsDragging(false);
  }

  return (
    <section
      className="promotion-carousel promotion-carousel-home"
      aria-label="Khuyến mãi nổi bật"
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { dragStart.current = null; setIsDragging(false); }}
    >
      <div key={`image-${activeIndex}`} className="promotion-image">
        <img src={currentSlide.image} alt={currentSlide.imageAlt || currentSlide.eyebrow} width={1920} height={832} />
      </div>
      <div className="promotion-shade" />
      <div className="promotion-content container">
        <span className="promotion-eyebrow" key={`${activeIndex}-eyebrow`}>{currentSlide.eyebrow}</span>
        <h1 key={`${activeIndex}-title`}>{currentSlide.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
        <p key={`${activeIndex}-description`}>{currentSlide.description}</p>
        <Link className="promotion-cta" href={currentSlide.href}>{currentSlide.cta}<span>↗</span></Link>
      </div>
      <div className="promotion-controls" role="group" aria-label="Điều khiển khuyến mãi">
        <button className="promotion-side-control promotion-side-previous" type="button" aria-label="Slide trước" onClick={() => moveSlide(-1)}>←</button>
        <div className="promotion-dots" role="group" aria-label="Chọn slide">{visibleSlides.map((slide, index) => <button key={slide.title} className={index === activeIndex ? 'active' : ''} type="button" aria-label={`Xem slide ${index + 1}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)} />)}</div>
        <button className="promotion-side-control promotion-side-next" type="button" aria-label="Slide tiếp theo" onClick={() => moveSlide(1)}>→</button>
        <button className="promotion-toggle" type="button" aria-label={isPaused ? 'Tiếp tục tự động chuyển' : 'Tạm dừng tự động chuyển'} onClick={() => setIsPaused((paused) => !paused)}>{isPaused ? '▶' : 'Ⅱ'}</button>
        <span className="promotion-counter" aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} / {String(visibleSlides.length).padStart(2, '0')}</span>
      </div>
      <span key={`progress-${activeIndex}`} className={`promotion-progress${isPaused ? ' paused' : ''}`} aria-hidden="true" />
    </section>
  );
}
