"use client";

import { useState } from "react";
import { contact } from "@/content/home";
import { site } from "@/content/site";

type Answers = Record<string, string | string[]>;

/**
 * Multi-step enquiry. Single-choice steps auto-advance, the services step is
 * multi-select, and the last step collects a note + contact details before
 * showing a read-back summary.
 */
export default function Contact() {
  const steps = contact.steps;
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [fields, setFields] = useState({ note: "", name: "", email: "" });
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);

  const go = (n: number, d: 1 | -1) => {
    setDir(d);
    setIdx(Math.max(0, Math.min(steps.length - 1, n)));
  };

  const pickSingle = (key: string, opt: string) => {
    setAnswers((a) => ({ ...a, [key]: opt }));
    setTimeout(() => go(idx + 1, 1), 340);
  };

  const toggleMulti = (key: string, opt: string) => {
    setAnswers((a) => {
      const cur = Array.isArray(a[key]) ? (a[key] as string[]) : [];
      return { ...a, [key]: cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt] };
    });
  };

  const send = () => {
    const ok = fields.name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email.trim());
    if (!ok) {
      setErr(true);
      return;
    }
    setErr(false);
    setDir(1);
    setDone(true);
  };

  const rows: [string, string][] = (
    [
      ["Working on", answers.project],
      ["Category", answers.category],
      ["Needs", Array.isArray(answers.services) ? answers.services.join(", ") : answers.services],
      ["Timeline", answers.timeline],
      ["Budget", answers.budget],
      ["Note", fields.note.trim()],
    ] as [string, string | string[] | undefined][]
  ).filter((r): r is [string, string] => !!r[1] && typeof r[1] === "string");

  const mailHref =
    `mailto:${site.email}?subject=` +
    encodeURIComponent("New enquiry — " + ((answers.project as string) || "Poppyns")) +
    "&body=" +
    encodeURIComponent(
      rows.map((r) => r[0] + ": " + r[1]).join("\n") + "\n\n" + fields.name.trim() + " · " + fields.email.trim()
    );

  const step = steps[idx];
  const total = steps.length;
  const progress = done ? 100 : (idx / total) * 100;

  return (
    <section id="contact" className="contact" data-theme="red" data-num="09">
      <div className="mono">{contact.label}</div>
      <div className="contact-grid">
        <div>
          <h2 data-reveal="" data-rise="">
            {contact.title[0]}
            <br />
            <span className="it">{contact.title[1]}</span>
          </h2>
          <p className="contact-body">
            {contact.sub[0]}
            <br />
            <strong>{contact.sub[1]}</strong>
          </p>
          <button
            className="pill connect"
            data-open={open ? "" : undefined}
            onClick={() => setOpen(true)}
            aria-expanded={open}
          >
            {contact.button} <span>↗</span>
          </button>
        </div>

        {!open ? (
          <button className="contact-ast" onClick={() => setOpen(true)} aria-label={contact.button}>
            ✳
          </button>
        ) : (
        <div className="form form-enter">
          <div className="form-top mono">
            <span>
              {String(Math.min(idx + 1, total)).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              className="form-back"
              data-on={idx > 0 && !done ? "" : undefined}
              onClick={() => go(idx - 1, -1)}
            >
              ← BACK
            </button>
          </div>
          <div className="form-prog">
            <div style={{ width: progress + "%" }} />
          </div>

          <div className="form-panels">
            {done ? (
              <div className="form-panel form-done" key="done">
                <div className="form-kicker">{contact.done.kicker}</div>
                <h3 className="form-q">{contact.done.title}</h3>
                <div className="summary">
                  {rows.map(([k, v]) => (
                    <div key={k}>
                      <span className="k">{k.toUpperCase()}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
                <p>{contact.done.body}</p>
                <a className="form-mail" href={mailHref}>
                  {contact.done.mail}
                </a>
              </div>
            ) : (
              <div className="form-panel" key={step.key} data-dir={dir < 0 ? "back" : undefined}>
                <div className="form-kicker">{step.kicker}</div>
                <h3 className="form-q">{step.question}</h3>

                {step.mode !== "fields" && (
                  <div className="chips">
                    {step.options!.map((opt) => {
                      const val = answers[step.key];
                      const on = Array.isArray(val) ? val.includes(opt) : val === opt;
                      return (
                        <button
                          key={opt}
                          className="chip"
                          data-on={on ? "" : undefined}
                          onClick={() =>
                            step.mode === "multi" ? toggleMulti(step.key, opt) : pickSingle(step.key, opt)
                          }
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {step.mode === "multi" && (
                  <button className="pill" onClick={() => go(idx + 1, 1)}>
                    {contact.continue}
                  </button>
                )}

                {step.mode === "fields" && (
                  <>
                    <textarea
                      className="field"
                      rows={2}
                      placeholder={contact.notePlaceholder}
                      value={fields.note}
                      onChange={(e) => setFields({ ...fields, note: e.target.value })}
                    />
                    <div className="field-row">
                      <input
                        className="field"
                        type="text"
                        placeholder={contact.namePlaceholder}
                        value={fields.name}
                        onChange={(e) => setFields({ ...fields, name: e.target.value })}
                      />
                      <input
                        className="field"
                        type="email"
                        placeholder={contact.emailPlaceholder}
                        value={fields.email}
                        onChange={(e) => setFields({ ...fields, email: e.target.value })}
                      />
                    </div>
                    <div className="form-err" data-on={err ? "" : undefined}>
                      {contact.error}
                    </div>
                    <button className="pill send" onClick={send}>
                      {contact.send}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
