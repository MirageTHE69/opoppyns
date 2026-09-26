import Icon from "@/components/shared/Icon";

type Props = {
  words: string[];
  /** smaller variant used on the Capabilities page */
  small?: boolean;
};

/** Infinite ticker. The outer layer skews with scroll velocity (see ScrollEffects). */
export default function Marquee({ words, small }: Props) {
  const run = (hidden?: boolean) => (
    <span aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <span key={w} style={{ display: "contents" }}>
          {w} <span className="ast"><Icon name="asterisk" /></span>{" "}
        </span>
      ))}
    </span>
  );

  return (
    <section className={small ? "marquee sm" : "marquee"} data-theme="dark">
      <div className="marquee-skew" data-marq="">
        <div className="marquee-track">
          {run()}
          {run(true)}
        </div>
      </div>
    </section>
  );
}
