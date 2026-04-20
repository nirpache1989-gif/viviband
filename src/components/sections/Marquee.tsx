/**
 * Pure-CSS horizontal marquee. Ports assets/index.html:55-70, 118-141.
 * Items are rendered twice so the translateX(-50%) loop is seamless.
 */

export type MarqueeItem = {
  label: string;
  italic?: boolean;
  dotColor?: string;
};

interface MarqueeProps {
  items: MarqueeItem[];
  reverse?: boolean;
  inverse?: boolean;
}

function renderItems(items: MarqueeItem[], keyPrefix: string) {
  return items.map((item, i) => (
    <span
      key={`${keyPrefix}-${i}`}
      className={`marquee__item ${item.italic ? "marquee__item--italic" : ""}`.trim()}
    >
      {item.label}
      {item.dotColor && (
        <span className="dot" style={{ background: item.dotColor }} />
      )}
    </span>
  ));
}

export default function Marquee({ items, reverse, inverse }: MarqueeProps) {
  const classes = [
    "marquee",
    reverse ? "marquee--reverse" : "",
    inverse ? "marquee--inverse" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="marquee__track">
        {renderItems(items, "a")}
        {renderItems(items, "b")}
      </div>
    </div>
  );
}
