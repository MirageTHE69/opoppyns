// Shared, site-wide content and brand tokens.

export const site = {
  name: "Poppyns Communications",
  email: "hello@poppyns.com",
  instagram: "https://instagram.com",
  tagline: "Communications for the curious.",
  copyright: "© 2026 Poppyns Communications",
};

// Accent used for interactive "active" states (accordion, filters).
// The design file's accent setting is #5A1F24 (burgundy); swap to "#E63946"
// for poppy red everywhere.
export const ACCENT = "#5A1F24";

export type NavLink = { label: string; href: string; key: string };

export const navLinks: NavLink[] = [
  { key: "services", label: "Services", href: "/#services" },
  { key: "thinking", label: "How we think", href: "/#thinking" },
  { key: "work", label: "Work", href: "/#work" },
  { key: "blog", label: "Blog", href: "/#blog" },
];
