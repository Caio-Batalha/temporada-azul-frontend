import { useEffect, useMemo, useState } from "react";

type DualImageCarouselProps = {
  pairs: Array<[string, string]>;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  intervalMs?: number;
  consumeClick?: boolean;
};

const DualImageCarousel = ({
  pairs,
  alt,
  fallbackSrc = "/media/boat-hero.svg",
  className,
  intervalMs = 5000,
  consumeClick = false,
}: DualImageCarouselProps) => {
  const safePairs = useMemo(() => {
    if (pairs.length > 0) return pairs;
    return [[fallbackSrc, fallbackSrc]] as Array<[string, string]>;
  }, [pairs, fallbackSrc]);

  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (safePairs.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safePairs.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [safePairs.length, intervalMs]);

  useEffect(() => {
    setBroken({});
  }, [index]);

  const canAdvance = safePairs.length > 1;
  const [leftSrc, rightSrc] = safePairs[index];

  return (
    <div
      className={`relative overflow-hidden ${canAdvance ? "cursor-pointer select-none" : ""} ${className ?? ""}`.trim()}
      role={canAdvance ? "button" : undefined}
      tabIndex={canAdvance ? 0 : undefined}
      aria-label={canAdvance ? "Ver próxima imagem" : undefined}
      onClick={(event) => {
        if (!canAdvance) return;
        if (consumeClick) {
          event.preventDefault();
          event.stopPropagation();
        }
        setIndex((prev) => (prev + 1) % safePairs.length);
      }}
      onKeyDown={(event) => {
        if (!canAdvance) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (consumeClick) event.stopPropagation();
        setIndex((prev) => (prev + 1) % safePairs.length);
      }}
    >
      <div className="grid h-full w-full grid-cols-2">
        <img
          src={broken[0] ? fallbackSrc : leftSrc}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setBroken((prev) => ({ ...prev, 0: true }))}
        />
        <img
          src={broken[1] ? fallbackSrc : rightSrc}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setBroken((prev) => ({ ...prev, 1: true }))}
        />
      </div>

      {safePairs.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {safePairs.map((pair, dotIndex) => (
            <span
              key={`${pair[0]}-${pair[1]}-${dotIndex}`}
              className={`h-2 w-2 rounded-full ${
                dotIndex === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DualImageCarousel;

