export interface Instructor {
  slug: string;
  name: string;
  email: string;
  bio: string;
  specialties: string[];
}

export const instructors: Instructor[] = [
  {
    slug: "kayla",
    name: "Kayla",
    email: "kaybay0405@gmail.com",
    bio: "Kayla is a passionate swim instructor who loves helping young swimmers build confidence in the water. With a focus on proper technique and fun, she creates a supportive environment where kids can thrive.",
    specialties: ["Freestyle & Backstroke", "Swimming Fundamentals", "Body Position & Balance"],
  },
  {
    slug: "jack",
    name: "Jack",
    email: "jackarneson51@gmail.com",
    bio: "Jack brings energy and enthusiasm to every lesson. He specializes in helping swimmers refine their strokes and master competitive skills like dives and turns.",
    specialties: ["Butterfly & Breaststroke", "Dives & Turns", "Pull Patterns & Breathing"],
  },
];

export function getInstructor(slug: string): Instructor | undefined {
  return instructors.find((i) => i.slug === slug);
}
