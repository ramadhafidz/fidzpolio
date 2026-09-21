export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnail: { src: string; alt: string };
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  date: string; // YYYY-MM-DD
  featured: boolean;
}

export interface SkillGroup {
  category: string;
  items: Skill[];
}

export interface Skill {
  name: string;
  /** Local SVG path, or undefined for a text-only chip. */
  icon?: string;
}
