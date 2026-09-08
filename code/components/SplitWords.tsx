import { Fragment } from "react";

/**
 * Splits a line into per-word spans for the scroll-linked typewriter reveal.
 * The animation itself lives in whichever section owns the timeline; this
 * only provides the `.split-word` targets.
 */
export default function SplitWords({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h2" | "blockquote" | "p";
}) {
  const words = text.split(" ");
  return (
    <Tag className={className}>
      {words.map((word, index) => (
        // The space lives outside the span: trailing whitespace inside an
        // inline-block is trimmed, which glues every word to the next.
        <Fragment key={`${word}-${index}`}>
          <span className="split-word inline-block will-change-transform">
            {word}
          </span>
          {index < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
