import Link from 'next/link';

type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  cards: { title: string; text: string; tone: string }[];
};

export function InfoPage({ eyebrow, title, description, actionLabel = 'Khám phá cửa hàng', actionHref = '/cua-hang', cards }: InfoPageProps) {
  return <section className="info-page container"><div className="info-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p><Link className="button button-primary" href={actionHref}>{actionLabel} →</Link></div><div className="info-card-grid">{cards.map((card, index) => <article className={`info-card ${card.tone}`} key={card.title}><span>0{index + 1}</span><h2>{card.title}</h2><p>{card.text}</p></article>)}</div></section>;
}
