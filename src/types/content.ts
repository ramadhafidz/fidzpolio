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
  /** One line of copy for the capability row. Optional — a row renders without it. */
  description?: string;
  items: Skill[];
}

export interface Skill {
  name: string;
}
