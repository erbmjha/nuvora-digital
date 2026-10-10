import { create } from "zustand";
import {
  CONTENT_REVISION,
  STORAGE_KEY,
  defaultProfile,
  newId,
  type Profile,
  type Service,
  type Stat,
  type Step,
  type WorkItem,
} from "@/data/profile";

type Saved = { revision: number; touched: boolean; profile: Profile };

type ProfileState = {
  profile: Profile;
  touched: boolean;
  notice: string | null;
  setProfile: (profile: Profile, touched?: boolean) => void;
  patch: (partial: Partial<Profile>) => void;
  patchService: (id: string, partial: Partial<Service>) => void;
  patchWork: (id: string, partial: Partial<WorkItem>) => void;
  patchStep: (id: string, partial: Partial<Step>) => void;
  patchStat: (id: string, partial: Partial<Stat>) => void;
  addService: () => void;
  removeService: (id: string) => void;
  addWork: () => void;
  removeWork: (id: string) => void;
  reset: () => void;
  clearNotice: () => void;
};

function mergeProfile(partial: Partial<Profile> | undefined): Profile {
  const base = structuredClone(defaultProfile);
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    services: partial.services?.length ? partial.services : base.services,
    work: partial.work?.length ? partial.work : base.work,
    steps: partial.steps?.length ? partial.steps : base.steps,
    stats: partial.stats?.length ? partial.stats : base.stats,
    clients: partial.clients ?? base.clients,
  };
}

export function readSaved(): { profile: Profile; touched: boolean } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    if (parsed.revision !== CONTENT_REVISION || !parsed.profile) return null;
    return { profile: mergeProfile(parsed.profile), touched: Boolean(parsed.touched) };
  } catch {
    return null;
  }
}

function writeSaved(profile: Profile, touched: boolean): string | null {
  try {
    const payload: Saved = { revision: CONTENT_REVISION, touched, profile };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return null;
  } catch {
    return "This device could not store the latest edit. Export still uses what is on screen.";
  }
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: structuredClone(defaultProfile),
  touched: false,
  notice: null,
  clearNotice: () => set({ notice: null }),
  setProfile: (profile, touched = true) => {
    const notice = writeSaved(profile, touched);
    set({ profile, touched, notice });
  },
  patch: (partial) => {
    const profile = { ...get().profile, ...partial };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  patchService: (id, partial) => {
    const profile = {
      ...get().profile,
      services: get().profile.services.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  patchWork: (id, partial) => {
    const profile = {
      ...get().profile,
      work: get().profile.work.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  patchStep: (id, partial) => {
    const profile = {
      ...get().profile,
      steps: get().profile.steps.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  patchStat: (id, partial) => {
    const profile = {
      ...get().profile,
      stats: get().profile.stats.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  addService: () => {
    const current = get().profile.services;
    if (current.length >= 6) return;
    const profile = {
      ...get().profile,
      services: [...current, { id: newId("svc"), title: "New capability", body: "What this work is, in two lines." }],
    };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  removeService: (id) => {
    const profile = { ...get().profile, services: get().profile.services.filter((item) => item.id !== id) };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  addWork: () => {
    const current = get().profile.work;
    if (current.length >= 3) return;
    const profile = {
      ...get().profile,
      work: [
        ...current,
        {
          id: newId("work"),
          title: "New piece",
          client: "Client",
          year: "2026",
          summary: "What the picture was for, and why it mattered.",
          image: "/profile/work-clay.jpg",
        },
      ],
    };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  removeWork: (id) => {
    const profile = { ...get().profile, work: get().profile.work.filter((item) => item.id !== id) };
    const notice = writeSaved(profile, true);
    set({ profile, touched: true, notice });
  },
  reset: () => {
    const profile = structuredClone(defaultProfile);
    const notice = writeSaved(profile, false);
    set({ profile, touched: false, notice });
  },
}));
