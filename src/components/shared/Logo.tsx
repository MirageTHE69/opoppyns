import Image from "next/image";

type Props = {
  /** "dark" = red + charcoal (for light backgrounds), "light" = red + cream (for dark backgrounds).
   *  Omit to let a parent switch it via CSS (the nav does this). */
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

/**
 * Poppyns wordmark. Both colour versions are stacked so the logo can
 * crossfade between them when the background behind it changes.
 * Size it by setting `height` (or `width`) on the wrapper.
 */
export default function Logo({ tone, className, priority }: Props) {
  return (
    <span className={className ? `logo ${className}` : "logo"} data-tone={tone}>
      <Image
        className="logo-dark"
        src="/logo.png"
        alt="Poppyns Communications"
        width={442}
        height={149}
        priority={priority}
      />
      <Image
        className="logo-light"
        src="/logo-light.png"
        alt=""
        aria-hidden
        width={442}
        height={149}
        priority={priority}
      />
      <Image
        className="logo-white"
        src="/logo-white.png"
        alt=""
        aria-hidden
        width={442}
        height={149}
        priority={priority}
      />
    </span>
  );
}
