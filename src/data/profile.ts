export type Service = { id: string; title: string; body: string };
export type WorkItem = {
  id: string;
  title: string;
  client: string;
  year: string;
  summary: string;
  image: string;
};
export type Step = { id: string; title: string; body: string };
export type Stat = { id: string; value: string; label: string };

export type Profile = {
  name: string;
  tagline: string;
  founded: string;
  city: string;
  website: string;
  email: string;
  phone: string;
  social: string;
  yearLabel: string;
  kicker: string;
  logo: string;
  coverImage: string;
  aboutEyebrow: string;
  aboutHeadline: string;
  aboutLeft: string;
  aboutRight: string;
  pull: string;
  mission: string;
  vision: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesIntro: string;
  services: Service[];
  workEyebrow: string;
  workTitle: string;
  workIntro: string;
  work: WorkItem[];
  closeEyebrow: string;
  stepsTitle: string;
  steps: Step[];
  stats: Stat[];
  clientsTitle: string;
  clients: string[];
  contactTitle: string;
  contactNote: string;
};

/** Bump when starter copy changes so a saved draft does not hide the new profile. */
export const CONTENT_REVISION = 6;

export const STORAGE_KEY = "folio-profile";

export const defaultProfile: Profile = {
  name: "Nuvora Digital",
  tagline: "Influence. Impact. Innovate.",
  founded: "2025",
  city: "Madhubani, Bihar",
  website: "https://nuvoradigital.in",
  email: "",
  phone: "+91 11 4000 2210",
  social: "@nuvoradigital",
  yearLabel: "2026",
  kicker: "Company profile",
  logo: "/profile/logo.png",
  coverImage: "/profile/cover.jpg",
  aboutEyebrow: "The studio",
  aboutHeadline: "Pictures people remember on a Tuesday.",
  aboutLeft:
    "Nuvora Digital is a media studio in Madhubani, Bihar. We write, shoot, design, and cut work for brands, films, and institutions that need a point of view, not another template.",
  aboutRight:
    "The room is small on purpose. Directors, editors, and strategists sit at the same table, so a film and the campaign around it are born together.",
  pull: "If it does not move someone, it is not finished.",
  mission: "Make work that earns attention without borrowing it.",
  vision: "A studio known for clarity, craft, and the nerve to say less.",
  servicesEyebrow: "Capabilities",
  servicesTitle: "What we make",
  servicesIntro: "One studio, from the line to the final grade. We do not hand the idea to a different room.",
  services: [
    {
      id: "svc-films",
      title: "Brand films",
      body: "Scripts, direction, and grade for films that carry a company, not a catalogue.",
    },
    {
      id: "svc-campaigns",
      title: "Campaigns",
      body: "From the line to the cutdowns. One idea, every length it has to live in.",
    },
    {
      id: "svc-social",
      title: "Social series",
      body: "Recurring formats with a voice, instead of a calendar full of noise.",
    },
    {
      id: "svc-doc",
      title: "Documentary",
      body: "Reported films for culture, cities, and the people who keep them running.",
    },
    {
      id: "svc-identity",
      title: "Identity",
      body: "Naming, art direction, and the stills a brand actually lives in.",
    },
    {
      id: "svc-launch",
      title: "Launch systems",
      body: "Teasers, trailers, and the day-of edit when the story goes public.",
    },
  ],
  workEyebrow: "Selected work",
  workTitle: "Recent pictures",
  workIntro: "A short reel of the kind of work the studio is built for.",
  work: [
    {
      id: "work-monsoon",
      title: "Monsoon Line",
      client: "North Mill",
      year: "2025",
      summary:
        "A monsoon film for a ninety-year-old textile house. No models. Looms, rain, and the people who keep the floor running.",
      image: "/profile/work-monsoon.jpg",
    },
    {
      id: "work-bus",
      title: "Night Bus",
      client: "Kaveri Transit",
      year: "2024",
      summary:
        "A four-minute portrait of the last buses out of the old city. Later used as the face of a public campaign.",
      image: "/profile/work-bus.jpg",
    },
    {
      id: "work-clay",
      title: "Clay & Co.",
      client: "Clay & Co.",
      year: "2025",
      summary: "A quiet product film. Hands, daylight, and objects that do not need to shout.",
      image: "/profile/work-clay.jpg",
    },
  ],
  closeEyebrow: "The practice",
  stepsTitle: "How the work gets made",
  steps: [
    { id: "step-1", title: "Listen", body: "The brief is a start, not a script. We find the thing that has to be true." },
    { id: "step-2", title: "Shape", body: "One line the whole room can repeat before anyone books a camera." },
    { id: "step-3", title: "Make", body: "Shoot and design in the same week, not the same quarter." },
    { id: "step-4", title: "Cut", body: "We lose the clever line if the picture is already stronger." },
  ],
  stats: [
    { id: "stat-years", value: "1", label: "Year of making pictures" },
    { id: "stat-films", value: "48", label: "Films shipped last year" },
    { id: "stat-people", value: "9", label: "People in the room" },
    { id: "stat-cities", value: "6", label: "Cities we shoot in" },
  ],
  clientsTitle: "Houses we have worked with",
  clients: [
    "North Mill",
    "Kaveri Transit",
    "Clay & Co.",
    "Paper Orchard",
    "Third Bell",
    "Ghat Radio",
    "Sable Atelier",
    "Fieldnote",
    "Red Courtyard",
  ],
  contactTitle: "Write to us",
  contactNote: "Send the work, the date, and what must be true when it is done.",
};

export function monogram(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "LH";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function profileFilename(name: string): string {
  const base = name
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "company"}-company-profile.pdf`;
}

export function nameSize(name: string): number {
  const n = name.trim().length;
  if (n > 32) return 46;
  if (n > 22) return 58;
  if (n > 16) return 72;
  return 88;
}

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
