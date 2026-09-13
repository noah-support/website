type AnimatedBackdropProps = {
  poster: string;
  motion: string;
  animate: boolean;
  className?: string;
  onReady?: () => void;
};

/**
 * Static JPG underneath, animated AVIF on top when motion is allowed.
 * AVIF animation cannot run in a <video> element.
 */
export default function AnimatedBackdrop({
  poster,
  motion,
  animate,
  className = "absolute inset-0 h-full w-full object-cover",
  onReady,
}: AnimatedBackdropProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden
        className={className}
        onLoad={onReady}
        onError={onReady}
      />
      {animate ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={motion} alt="" aria-hidden className={className} />
      ) : null}
    </>
  );
}
