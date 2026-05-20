import { useEffect, useMemo, useState } from "react";

type ImageCarouselProps = {
  images: string[];
  alt: string;
  fallbackSrc?: string;
  fit?: "cover" | "contain";
  fitByIndex?: Record<number, "cover" | "contain">;
  imagePosition?: string;
  className?: string;
  intervalMs?: number;
  clickToNext?: boolean;
  consumeClick?: boolean;
};

const ImageCarousel = ({
  images,
  alt,
  fallbackSrc = "/media/boat-hero.svg",
  fit = "cover",
  fitByIndex,
  imagePosition,
  className,
  intervalMs = 5000,
  clickToNext = true,
  consumeClick = false,
}: ImageCarouselProps) => {
  const safeImages = useMemo(
    () => (images.length > 0 ? images : [fallbackSrc]),
    [images],
  );
  const [index, setIndex] = useState(0);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (safeImages.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeImages.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [safeImages.length, intervalMs]);

  useEffect(() => {
    setIsFallback(false);
  }, [index, safeImages]);

  const currentFit = fitByIndex?.[index] ?? fit;
  const canAdvance = clickToNext && safeImages.length > 1;

  return (
    <div
      className={`relative overflow-hidden ${
        currentFit === "contain" ? "bg-deep-50" : ""
      } ${canAdvance ? "cursor-pointer select-none" : ""} ${className ?? ""}`.trim()}
      role={canAdvance ? "button" : undefined}
      tabIndex={canAdvance ? 0 : undefined}
      aria-label={canAdvance ? "Ver próxima imagem" : undefined}
      onClick={(event) => {
        if (!canAdvance) return;
        if (consumeClick) {
          event.preventDefault();
          event.stopPropagation();
        }
        setIndex((prev) => (prev + 1) % safeImages.length);
      }}
      onKeyDown={(event) => {
        if (!canAdvance) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        if (consumeClick) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
        }
        setIndex((prev) => (prev + 1) % safeImages.length);
      }}
    >
      <img
        src={isFallback ? fallbackSrc : safeImages[index]}
        alt={alt}
        className={`h-full w-full ${
          currentFit === "contain" ? "object-contain" : "object-cover"
        } transition-opacity duration-700`}
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
        onError={() => setIsFallback(true)}
      />
      {safeImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {safeImages.map((image, dotIndex) => (
            <span
              key={image}
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

export default ImageCarousel;
