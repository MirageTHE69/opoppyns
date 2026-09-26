import Image from "next/image";

type Props = {
  /** "dark" = red + charcoal (for light backgrounds), "light" = red + cream (for dark backgrounds).
   *  Omit to let a parent switch it via CSS (the nav does this). */
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

// Vector artwork (public/logo*.svg), cropped to the wordmark.
const W = 395;
const H = 164;

/**
 * Poppyns wordmark. All colour versions are stacked so the logo can
 * crossfade between them when the background behind it changes.
 * Size it by setting `height` (or `width`) on the wrapper.
 */
export default function Logo({ tone, className, priority }: Props) {
  const variant = (cls: string, src: string, alt: string) => (
    <Image
      className={cls}
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={W}
      height={H}
      priority={priority}
      unoptimized
    />
  );
  return (
    <span className={className ? `logo ${className}` : "logo"} data-tone={tone}>
      {variant("logo-dark", "/logo.svg", "Poppyns Communications")}
      {variant("logo-light", "/logo-light.svg", "")}
      {variant("logo-white", "/logo-white.svg", "")}
    </span>
  );
}
