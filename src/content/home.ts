// All copy for the home page. Edit here; components read from this file.

export const splash = {
  footLeft: "MAKING BRANDS LESS BORING SINCE 2026",
  videoSrc:
    "https://ik.imagekit.io/5feqwwaxb/MARCA%20WEBSITE%2001.mp4?updatedAt=1789718697258",
  videoLabel: "SHOWREEL 2026 / MUTED / ON LOOP",
};

export const hero = {
  eyebrow: "POPPYNS COMMUNICATIONS",
  // Two lines of the headline. `italic` words render in Fraunces italic.
  headline: [
    [{ text: "Make" }, { text: "them" }],
    [{ text: "look twice", italic: true, dot: true }],
  ] as { text: string; italic?: boolean; dot?: boolean }[][],
  lede: "Strategy, creativity and communication for brands with somewhere to go.",
  cta: { label: "Come say hello", href: "#contact" },
};

export const manifesto = {
  label: "01 — MANIFESTO",
  lines: ["Nothing interesting", "happens by accident."],
};

export const values = [
  "CURIOSITY",
  "INSTINCT",
  "STRATEGY",
  "CULTURE",
  "CRAFT",
  "IDEAS",
  "ATTITUDE",
  "DETAIL",
  "DESIRE",
  "CHAOS",
  "CLARITY",
  "RELEVANCE",
];

export const atmosphere = {
  label: "02 — A LITTLE ATMOSPHERE",
  title: ["Move your", "cursor."],
  sub: "Colour appears when curiosity takes over.",
  clear: "Clear the room ↗",
  hues: ["#E3B023", "#E63946", "#8A9A5B", "#C98B5E", "#5A1F24"],
};

export const services = {
  label: "03 — SERVICES",
  groups: [
    {
      title: "Strategy",
      items: [
        "Brand Strategy",
        "Positioning",
        "Market & Audience Research",
        "Communication Strategy",
        "Creative Strategy",
      ],
    },
    {
      title: "Digital",
      items: [
        "Social Media",
        "Content",
        "Performance Marketing",
        "Influencer & Creator Marketing",
        "Websites & Digital Experiences",
      ],
    },
    {
      title: "Production",
      items: ["Art Direction", "Photography", "Videography", "Graphic Design", "Motion & Animation"],
    },
    {
      title: "Campaigns",
      items: [
        "Campaign Strategy",
        "Creative Concepts",
        "Product & Brand Launches",
        "Integrated Campaigns",
        "Experiential & Activations",
      ],
    },
  ],
};

export const quote = {
  label: "04 — A THOUGHT WE LIKE",
  // Words fly together into this sentence as you scroll.
  text: "The best ideas come as jokes. Make your thinking as funny as possible.",
  // How many trailing words get the red italic treatment.
  accentLast: 4,
  by: "— David Ogilvy",
};

export const howWeThink = {
  label: "05 — HOW WE THINK",
  // left/top are % positions on desktop; depth drives mouse parallax.
  words: [
    { n: "01", word: "Observe", note: "look a little closer", left: 6, top: 56, depth: 1.6 },
    { n: "02", word: "Question", note: "ask why", left: 28, top: 26, depth: -2.2 },
    { n: "03", word: "Think", note: "connect the dots", left: 45, top: 62, depth: 2.4 },
    { n: "04", word: "Idea", note: "make it yours", left: 64, top: 16, depth: -1.4 },
    { n: "05", word: "Make", note: "put it out there", left: 80, top: 48, depth: 1.9 },
  ],
};

export const work = {
  label: "06 — CASE STUDIES",
  title: ["What we've been", "up to."],
  sub: "A few things we've been making, building and thinking about.",
  cta: { label: "View all work →", href: "#work" },
  // Swap in real project imagery + titles when ready. `title` is optional.
  projects: [
    { src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&q=80&auto=format", alt: "Studio work in progress", title: "" },
    { src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1000&q=80&auto=format", alt: "Campaign moodboard", title: "" },
    { src: "https://images.unsplash.com/photo-1452802447250-470a88ac82bc?w=1000&q=80&auto=format", alt: "Photography set", title: "" },
    { src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1400&q=80&auto=format", alt: "Design sketches", title: "" },
  ],
};

export const blog = {
  label: "07 — BLOG",
  title: ["Things we're", "thinking about."],
  sub: "Ideas, observations and the occasional thought we couldn't keep to ourselves.",
  cta: { label: "Read more →", href: "#blog" },
};

export type FormStep = {
  key: string;
  mode: "single" | "multi" | "fields";
  kicker: string;
  question: string;
  options?: string[];
};

export const contact = {
  label: "08 — SAY HELLO",
  title: ["Tell us what's", "cooking."],
  sub: [
    "Starting something? Fixing something? Completely lost and pretending you're not?",
    "We're good with all three.",
  ],
  button: "Let’s Connect",
  // The enquiry form that opens from the button.
  steps: [
    {
      key: "project",
      mode: "single",
      kicker: "THE SHAPE OF IT",
      question: "What are you working on?",
      options: [
        "A brand new brand",
        "A rebrand / sharpening",
        "A campaign or launch",
        "An always-on content engine",
        "A website",
        "Still figuring it out",
      ],
    },
    {
      key: "services",
      mode: "multi",
      kicker: "PICK AS MANY AS APPLY",
      question: "What do you need from us?",
      options: ["Strategy", "Digital", "Production", "Campaigns", "Not sure yet"],
    },
    {
      key: "timeline",
      mode: "single",
      kicker: "PACE",
      question: "When does this need to exist?",
      options: ["Yesterday", "Next 4–6 weeks", "This quarter", "Just exploring"],
    },
    {
      key: "details",
      mode: "fields",
      kicker: "LAST ONE",
      question: "Tell us what's cooking.",
    },
  ] as FormStep[],
  notePlaceholder: "The messy version is fine.",
  namePlaceholder: "Your name",
  emailPlaceholder: "Email",
  error: "ADD A NAME AND A VALID EMAIL",
  continue: "Continue →",
  send: "Send it over →",
  done: {
    kicker: "RECEIVED",
    title: "Here's what we heard.",
    body: "We read everything ourselves. Expect a reply within two working days.",
    mail: "OPEN IT IN EMAIL ↗",
  },
};
