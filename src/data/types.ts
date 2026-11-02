export type Level = "Beginner" | "Intermediate" | "Advanced";

export type Tool = {
  slug: string;
  name: string;
  aka: string;
  category: string;
  level: Level;
  minutes: number;
  summary: string;
  overview: string;
  defender: string;
  install: string;
  syntax: string;
  flags: { flag: string; meaning: string }[];
  steps: string[];
  tags: string[];
};

export type Command = {
  name: string;
  category: string;
  summary: string;
  syntax: string;
  example: string;
};

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  topic: string;
  level: Level;
  minutes: number;
  summary: string;
  sections: ArticleSection[];
};

export type Lab = {
  slug: string;
  name: string;
  summary: string;
  group: string;
};
