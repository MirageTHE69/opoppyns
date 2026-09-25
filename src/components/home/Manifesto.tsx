import { manifesto } from "@/content/home";

export default function Manifesto() {
  return (
    <section id="manifesto" className="manifesto" data-theme="dark" data-num="02">
      <div data-reveal="" className="mono">
        {manifesto.label}
      </div>
      <h2 data-reveal="" data-rise="">
        {manifesto.lines[0]}
        <br />
        <span className="it">{manifesto.lines[1]}</span>
      </h2>
      <span className="manifesto-ast" aria-hidden>
        ✳
      </span>
    </section>
  );
}
