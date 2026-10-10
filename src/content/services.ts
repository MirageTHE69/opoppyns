// Service detail pages (/services/[slug]) and the home-page services list.
// Service names come from the brief; taglines, descriptions and steps are
// demo copy. Replace freely.

export type Service = {
  slug: string;
  title: string;
  /** big italic line under the title */
  tagline: string;
  intro: string;
  items: { name: string; body: string }[];
  steps: { title: string; body: string }[];
};

export const serviceList: Service[] = [
  {
    slug: "strategy",
    title: "Strategy",
    tagline: "Know what you're saying before you say it.",
    intro:
      "Most brands don't have a communication problem. They have a clarity problem. We find the one thing worth saying, who needs to hear it, and why they'd care.",
    items: [
      { name: "Brand Strategy", body: "What you stand for, who it's for and why it matters, written so a new hire could explain it." },
      { name: "Positioning", body: "The space you can own in someone's head, and the spaces you should politely leave to others." },
      { name: "Market & Audience Research", body: "Real conversations, real behaviour and the patterns hiding in both." },
      { name: "Communication Strategy", body: "What to say, where to say it and in what order, so the message builds instead of repeating." },
      { name: "Creative Strategy", body: "The sharp, usable thought that turns a business goal into a brief worth answering." },
    ],
    steps: [
      { title: "Listen", body: "Interviews, audits and a lot of reading. We look for what people actually say, not what the deck says." },
      { title: "Sharpen", body: "We cut until one idea is left standing. If it can't fit on a sticky note, it isn't ready." },
      { title: "Hand over", body: "A strategy people reopen: short, plain and specific enough to make decisions with." },
    ],
  },
  {
    slug: "digital",
    title: "Digital",
    tagline: "Show up where people already are.",
    intro:
      "The internet is not a channel, it's where your audience lives. We build a presence that feels native to each corner of it and still sounds like one brand.",
    items: [
      { name: "Social Media", body: "Platform-native ideas, a clear voice and a calendar that leaves room for the unplanned." },
      { name: "Content", body: "Formats people return to, built on a few strong pillars instead of a hundred loose posts." },
      { name: "Performance Marketing", body: "Paid media that starts with good creative, then earns its budget with numbers." },
      { name: "Influencer & Creator Marketing", body: "The right voices, briefed properly and trusted to sound like themselves." },
      { name: "Websites & Digital Experiences", body: "Sites that load fast, read well and make the next step obvious." },
    ],
    steps: [
      { title: "Map", body: "Where your audience spends time, what they do there and what they ignore." },
      { title: "Make", body: "Content and experiences designed for each place, not resized from one master file." },
      { title: "Measure", body: "A monthly read on what worked, what didn't and what we're changing because of it." },
    ],
  },
  {
    slug: "production",
    title: "Production",
    tagline: "Ideas are cheap. Craft is not.",
    intro:
      "A good idea badly made is a bad idea. Our production team carries the thought all the way through, from the first frame to the final export.",
    items: [
      { name: "Art Direction", body: "A visual point of view that holds together across every shoot, post and page." },
      { name: "Photography", body: "Product, people and places, shot to feel like your brand and nobody else's." },
      { name: "Videography", body: "Films, reels and everything in between, planned for the screen they'll live on." },
      { name: "Graphic Design", body: "Identity, layouts and systems that stay consistent without becoming boring." },
      { name: "Motion & Animation", body: "Movement with a reason: to explain, to delight, or to make someone look twice." },
    ],
    steps: [
      { title: "Plan", body: "Treatments, shot lists and references, agreed before anyone picks up a camera." },
      { title: "Shoot", body: "Small, focused crews who know the idea as well as the strategist does." },
      { title: "Finish", body: "Edit, grade, sound and design, delivered in every format you'll actually need." },
    ],
  },
  {
    slug: "campaigns",
    title: "Campaigns",
    tagline: "One idea, everywhere it needs to be.",
    intro:
      "A campaign is a single thought with the stamina to travel. We build the idea first, then work out everywhere it deserves to show up.",
    items: [
      { name: "Campaign Strategy", body: "The problem, the audience and the one thing this campaign needs to change." },
      { name: "Creative Concepts", body: "Routes with a real point of view, so choosing between them is an actual decision." },
      { name: "Product & Brand Launches", body: "The build-up, the moment and what happens the week after everyone stops talking." },
      { name: "Integrated Campaigns", body: "Film, social, outdoor and digital working as one story rather than four." },
      { name: "Experiential & Activations", body: "Things people can walk into, touch and tell their friends about." },
    ],
    steps: [
      { title: "Find it", body: "Three routes, each strong enough to stand alone. We recommend one and say why." },
      { title: "Build it", body: "Every asset made properly, in the format that belongs on each platform." },
      { title: "Land it", body: "Launch, watch closely and adjust while it still matters." },
    ],
  },
];

export const getService = (slug: string) => serviceList.find((s) => s.slug === slug);

// Shared labels for the service pages.
export const servicePage = {
  crumb: "SERVICES",
  insideLabel: "WHAT'S INSIDE",
  stepsLabel: "HOW IT RUNS",
  othersLabel: "MORE WAYS IN",
  explore: "Explore",
  back: "← All services",
};
