import Link from 'next/link';

type CollectionPageProps = { eyebrow: string; title: string; description: string; items: string[]; images?: string[]; ctaHref?: string; itemHrefs?: string[] };

const fallbackImages = [
  '/assets/images/cat-indoor.jpg',
  '/assets/images/cat-desk.jpg',
  '/assets/images/cat-succulents.jpg',
  '/assets/images/cat-pots.jpg',
];

export function CollectionPage({ eyebrow, title, description, items, images = [], ctaHref = '/cua-hang', itemHrefs = [] }: CollectionPageProps) {
  const cardImages = images.length ? images : fallbackImages;

  return (
    <section className="collection-page container">
      <div className="collection-hero">
        <div className="collection-intro">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <Link className="button button-primary" href={ctaHref}>Khám phá ngay</Link>
        </div>
        <div className="collection-spotlight" style={{ backgroundImage: `linear-gradient(140deg, rgba(51,64,44,.12), rgba(51,64,44,.65)), url(${cardImages[0]})` }}>
          <span>Plant Shop note</span>
          <strong>Góc xanh được chọn kỹ theo nhu cầu sống của bạn.</strong>
        </div>
      </div>

      <div className="collection-grid">
        {items.map((item, index) => (
          <Link className={`collection-card collection-tone-${index % 4}${cardImages[index] ? ' collection-card-image' : ''}`} href={itemHrefs[index] || ctaHref} key={item} style={cardImages[index] ? { backgroundImage: `linear-gradient(180deg, rgba(15,42,29,.06), rgba(15,42,29,.8)), url(${cardImages[index]})` } : undefined}>
            <span>0{index + 1}</span>
            <h2>{item}</h2>
            <small>Xem bộ sưu tập →</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
