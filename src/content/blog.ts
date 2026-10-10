// Blog listing (/blog) and article pages (/blog/[slug]).
// The two articles below are demo content. To add a post, add an entry here.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  category: string;
  /** ISO date, e.g. 2026-09-18 */
  date: string;
  readTime: string;
  excerpt: string;
  cover: { src: string; alt: string };
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "why-your-brand-sounds-like-everyone-else",
    title: "Why your brand sounds like everyone else",
    category: "Brands",
    date: "2026-09-18",
    readTime: "4 min read",
    excerpt:
      "Open five websites in your category. Cover the logos. If you can't tell which one is yours, your customers can't either.",
    cover: {
      src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800&q=80&auto=format",
      alt: "An empty studio room with glass partitions",
    },
    body: [
      {
        type: "p",
        text: "Try a small experiment. Open five websites from your category, cover the logos and read the first line of each one out loud. Passionate. Innovative. Customer-first. Trusted by thousands. If you can't tell which one is yours, your customers can't either.",
      },
      {
        type: "p",
        text: "This isn't laziness. It's what happens when sensible people make sensible decisions, one at a time, until nothing interesting is left.",
      },
      { type: "h2", text: "Sameness is the safe choice" },
      {
        type: "p",
        text: "Every category has a way it's supposed to sound. Banks sound reassuring. Skincare sounds scientific. Tech sounds like it was written by the product itself. Borrowing that voice feels low-risk, because nobody ever got fired for sounding like the market leader.",
      },
      {
        type: "p",
        text: "But the market leader can afford to be forgettable. They have the budget to be everywhere. You don't, which means every line you publish has to work harder than theirs.",
      },
      { type: "quote", text: "If a competitor could sign their name under your sentence, it isn't your sentence yet." },
      { type: "h2", text: "Three ways to find your own voice" },
      {
        type: "list",
        items: [
          "Write down what you'd never say. A brand is easier to hear once you know what it refuses to sound like.",
          "Listen to how your best customers describe you. Their words are usually plainer, funnier and more specific than yours.",
          "Pick an opinion. Not a controversy, just a clear view on how things should be done in your category.",
        ],
      },
      {
        type: "p",
        text: "None of this needs a rebrand. It needs a decision, and then the discipline to keep making the same decision in every caption, email and headline for a year.",
      },
      { type: "h2", text: "The test" },
      {
        type: "p",
        text: "Before anything goes out, cover the logo. If the line could belong to anyone, send it back. It's a slightly annoying habit, and it's the cheapest piece of brand strategy you'll ever run.",
      },
    ],
  },
  {
    slug: "the-brief-is-not-the-idea",
    title: "The brief is not the idea",
    category: "Craft",
    date: "2026-08-27",
    readTime: "3 min read",
    excerpt:
      "A good brief points at a problem. A bad one hides a solution inside it and hopes nobody notices.",
    cover: {
      src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1800&q=80&auto=format",
      alt: "A team working together around a table",
    },
    body: [
      {
        type: "p",
        text: "Most briefs we receive already contain an answer. \"We need a film.\" \"We want to go viral.\" \"Something like that campaign from last year, but for us.\" It's understandable. A solution feels more useful than a question.",
      },
      {
        type: "p",
        text: "The trouble is that a brief with the answer baked in can only ever produce that answer. And the first answer is rarely the interesting one.",
      },
      { type: "h2", text: "What a brief is for" },
      {
        type: "p",
        text: "A brief has one job: to describe a problem so clearly that a good idea becomes possible. Who are we talking to? What do they think now? What do we want them to think instead? What's stopping them?",
      },
      {
        type: "p",
        text: "Four questions. If a brief answers them honestly, it can be half a page long. If it doesn't, forty slides won't save it.",
      },
      { type: "quote", text: "Fall in love with the problem. The idea will turn up when it's ready." },
      { type: "h2", text: "Leave room for surprise" },
      {
        type: "p",
        text: "The best work we've been part of started with a brief that was specific about the problem and relaxed about the format. A film brief that became a poster. A launch that became a letter. A campaign that turned out to be a change to the packaging.",
      },
      {
        type: "p",
        text: "None of that happens if the deliverable is decided before the thinking starts.",
      },
      { type: "h2", text: "So, the next time you write one" },
      {
        type: "list",
        items: [
          "Describe the problem in one sentence a friend outside the company would understand.",
          "Say what success looks like in behaviour, not in views.",
          "Delete the line that begins with \"we were thinking maybe\".",
        ],
      },
      {
        type: "p",
        text: "Then hand it over and let people surprise you. That's what you're paying them for.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// Shared labels for the blog pages.
export const blogPage = {
  label: "BLOG",
  title: ["Things we're", "thinking about."],
  sub: "Ideas, observations and the occasional thought we couldn't keep to ourselves.",
  read: "Read article",
  back: "← All articles",
  by: "Written by Poppyns",
  nextLabel: "READ NEXT",
};

// Closing call-to-action shown at the bottom of service and blog pages.
export const pageCta = {
  title: ["Tell us what's", "cooking."],
  button: "Let’s Connect",
  href: "/#contact",
};
