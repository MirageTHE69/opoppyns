import { Fragment } from "react";

/*
 * Drawn SVG glyphs. Characters like ✳ and ↗ render as colour emoji on many
 * phones (iOS especially), so every decorative symbol on the site is an SVG
 * that inherits the text colour and scales with font-size (1em).
 */

export type IconName = "asterisk" | "arrow-up-right" | "arrow-right" | "arrow-left" | "arrow-up" | "arrow-down";

const paths: Record<IconName, string> = {
  // eight-spoked asterisk
  asterisk: "M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07",
  "arrow-up-right": "M7 17 17 7M8 7h9v9",
  "arrow-right": "M4 12h16M14 6l6 6-6 6",
  "arrow-left": "M20 12H4M10 6l-6 6 6 6",
  "arrow-up": "M12 20V4M6 10l6-6 6 6",
  "arrow-down": "M12 4v16M6 14l6 6 6-6",
};

type Props = {
  name: IconName;
  /** stroke width in 24-unit viewBox space; thinner reads better at large sizes */
  weight?: number;
  className?: string;
};

export default function Icon({ name, weight, className }: Props) {
  const w = weight ?? (name === "asterisk" ? 1.6 : 1.8);
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
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
