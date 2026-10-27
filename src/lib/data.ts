import fs from "fs/promises";
import path from "path";
import { posts as defaultPosts, type Post } from "@/content/blog";
import { serviceList as defaultServices, type Service } from "@/content/services";

export type PortfolioProject = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category?: string;
  year?: string;
  link?: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  email: string;
  instagram: string;
  heroEyebrow: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroLede: string;
  adminPassword?: string;
};

export type ContentDatabase = {
  posts: Post[];
  services: Service[];
  portfolio: PortfolioProject[];
  settings: SiteSettings;
};

export const defaultPortfolio: PortfolioProject[] = [
  {
    id: "proj-1",
    src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1400&q=80&auto=format",
    alt: "Studio work in progress",
    title: "Brand Identity & Spatial",
    category: "Branding",
    year: "2026",
    link: "#work",
  },
  {
    id: "proj-2",
    src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1000&q=80&auto=format",
    alt: "Campaign moodboard",
    title: "Global Campaign Strategy",
    category: "Campaigns",
    year: "2026",
    link: "#work",
  },
  {
    id: "proj-3",
    src: "https://images.unsplash.com/photo-1452802447250-470a88ac82bc?w=1000&q=80&auto=format",
    alt: "Photography set",
    title: "Editorial Lookbook & Film",
    category: "Production",
    year: "2026",
    link: "#work",
  },
  {
    id: "proj-4",
    src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1400&q=80&auto=format",
    alt: "Design sketches",
    title: "Digital Platform Experience",
    category: "Digital",
    year: "2026",
    link: "#work",
  },
];

export const defaultSettings: SiteSettings = {
  siteName: "Poppyns Communications",
  tagline: "Communications for the curious.",
  email: "hello@poppyns.com",
  instagram: "https://instagram.com",
  heroEyebrow: "POPPYNS COMMUNICATIONS",
  heroHeadline1: "Make them",
  heroHeadline2: "look twice",
  heroLede: "Strategy, creativity and communication for brands with somewhere to go.",
  adminPassword: "admin123",
};

export const defaultDatabase: ContentDatabase = {
  posts: defaultPosts,
  services: defaultServices,
  portfolio: defaultPortfolio,
  settings: defaultSettings,
};

const DB_PATH = path.join(process.cwd(), "src", "data", "content.json");

export async function getSiteData(): Promise<ContentDatabase> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const data = JSON.parse(raw);
    return {
      posts: Array.isArray(data.posts) ? data.posts : defaultPosts,
      services: Array.isArray(data.services) ? data.services : defaultServices,
      portfolio: Array.isArray(data.portfolio) ? data.portfolio : defaultPortfolio,
      settings: data.settings ? { ...defaultSettings, ...data.settings } : defaultSettings,
    };
  } catch {
    // If file doesn't exist yet, seed it and return default
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(defaultDatabase, null, 2), "utf-8");
    } catch (writeErr) {
      console.error("Failed to seed default database file:", writeErr);
    }
    return defaultDatabase;
  }
}

export async function saveSiteData(data: Partial<ContentDatabase>): Promise<ContentDatabase> {
  const current = await getSiteData();
  const updated: ContentDatabase = {
    posts: data.posts ?? current.posts,
    services: data.services ?? current.services,
    portfolio: data.portfolio ?? current.portfolio,
    settings: data.settings ? { ...current.settings, ...data.settings } : current.settings,
  };

  await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

export async function getPosts(): Promise<Post[]> {
  const data = await getSiteData();
  return data.posts;
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getServices(): Promise<Service[]> {
  const data = await getSiteData();
  return data.services;
}

export async function getService(slug: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((s) => s.slug === slug);
}

export async function getPortfolio(): Promise<PortfolioProject[]> {
  const data = await getSiteData();
  return data.portfolio;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await getSiteData();
  return data.settings;
}
