import { Fragment } from "react";

/*
 * Drawn SVG glyphs. Characters like ✳ and ↗ render as colour emoji on many
 * phones (iOS especially), so every decorative symbol on the site is an SVG
 * that inherits the text colour and scales with font-size (1em).
 */

export type IconName = "asterisk" | "arrow-up-right" | "arrow-right" | "arrow-left" | "arrow-up" | "arrow-down";

// The brand asterisk: the exact five-armed shape from the Poppyns logo
// (public/new-logo.svg). Solid, not stroked. Its viewBox is centred on the
// hub so it spins evenly.
const ASTERISK_PATH =
  "M19.203-36.922 14.016-26.656 5.578-32.844 13.656-40.719 13.406-41.531 2.203-43.203 5.469-53.266 15.453-47.969 16.141-48.422 14.219-59.578H24.828L22.953-48.422 23.594-47.969 33.625-53.188 36.891-43.156 25.766-41.531 25.516-40.719 33.453-32.844 24.984-26.609 19.938-36.922Z";
const ASTERISK_VIEWBOX = "1.35 -60.1 36.4 36.4";

const paths: Record<Exclude<IconName, "asterisk">, string> = {
  "arrow-up-right": "M7 17 17 7M8 7h9v9",
  "arrow-right": "M4 12h16M14 6l6 6-6 6",
  "arrow-left": "M20 12H4M10 6l-6 6 6 6",
  "arrow-up": "M12 20V4M6 10l6-6 6 6",
  "arrow-down": "M12 4v16M6 14l6 6 6-6",
};

type Props = {
  name: IconName;
  /** stroke width for the arrow icons, in 24-unit viewBox space (the asterisk is a solid shape and ignores it) */
  weight?: number;
  className?: string;
};

export default function Icon({ name, weight, className }: Props) {
  const cls = className ? `icon ${className}` : "icon";
  if (name === "asterisk") {
    return (
      <svg
        className={cls}
        viewBox={ASTERISK_VIEWBOX}
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d={ASTERISK_PATH} />
      </svg>
    );
  }
  const w = weight ?? 1.8;
  return (
    <svg
      className={cls}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}

const charMap: Record<string, IconName> = {
  "✳": "asterisk",
  "↗": "arrow-up-right",
  "→": "arrow-right",
  "←": "arrow-left",
  "↑": "arrow-up",
  "↓": "arrow-down",
};

/** Renders a string, swapping any ✳ ↗ → ← ↑ ↓ characters for SVG icons. */
export function Glyphs({ text }: { text: string }) {
  const parts = text.split(/([✳↗→←↑↓])/);
  return (
    <>
      {parts.map((p, i) =>
        charMap[p] ? <Icon key={i} name={charMap[p]} /> : <Fragment key={i}>{p}</Fragment>
      )}
    </>
  );
}
