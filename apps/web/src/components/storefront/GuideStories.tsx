'use client';

import Link from 'next/link';
import { useState } from 'react';
import { stories, storyCategories } from './story-data';

export function GuideStories() {
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const visibleStories = activeCategory === 'Tất cả' ? stories : stories.filter((story) => story.category === activeCategory);

  return <section className="guide-stories"><div className="guide-stories-heading"><div><span className="eyebrow">Góc chăm cây · Nhật ký vườn</span><h2>Những câu chuyện nhỏ,<br /><em>giúp cây lớn cùng bạn.</em></h2></div><span className="guide-stories-count"><strong>{visibleStories.length.toString().padStart(2, '0')}</strong> / {stories.length.toString().padStart(2, '0')} bài</span></div><div className="stories-layout"><aside className="stories-sidebar"><span className="stories-sidebar-label">Mục lục khu vườn</span>{storyCategories.map((category, index) => <button className={activeCategory === category ? 'active' : ''} key={category} type="button" onClick={() => setActiveCategory(category)}><span>{category === 'Tất cả' ? '✦' : `0${index}`}</span>{category}<b>→</b></button>)}<div className="stories-sidebar-note"><strong>Ghi chú của vườn</strong><p>Chăm cây là một cuộc trò chuyện chậm. Hãy bắt đầu từ việc quan sát.</p></div></aside><div className="guide-story-grid" key={activeCategory}>{visibleStories.map((story, index) => <article className={`guide-story-card ${story.tone}${index === 0 && activeCategory === 'Tất cả' ? ' guide-story-featured' : ''}`} style={{ animationDelay: `${index * 90}ms` }} key={story.slug}><div className="guide-story-image" style={{ backgroundImage: `url(${story.image})` }}><span>0{index + 1}</span>{index === 0 && activeCategory === 'Tất cả' && <b>NÊN ĐỌC</b>}</div><div className="guide-story-content"><small>{story.category} · {story.readTime}</small><h3>{story.title}</h3><p>{story.excerpt}</p><Link href={`/bai-viet/${story.slug}`}>Đọc câu chuyện <span>→</span></Link></div></article>)}</div></div></section>;
}
