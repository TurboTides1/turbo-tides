import { db } from "@/lib/db";
import { instructorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { instructors, getInstructor, type Instructor } from "@/lib/instructors";

export interface MergedInstructor extends Instructor {
  photoUrl: string | null;
  videoUrl: string | null;
}

function splitSpecialties(raw: string | null): string[] | null {
  if (!raw) return null;
  const list = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : null;
}

export async function getMergedInstructor(
  slug: string
): Promise<MergedInstructor | null> {
  const base = getInstructor(slug);
  if (!base) return null;

  const [overlay] = await db
    .select()
    .from(instructorProfiles)
    .where(eq(instructorProfiles.slug, slug));

  return {
    ...base,
    name: overlay?.name || base.name,
    bio: overlay?.bio || base.bio,
    specialties: splitSpecialties(overlay?.specialties ?? null) ?? base.specialties,
    photoUrl: overlay?.photoUrl ?? null,
    videoUrl: overlay?.videoUrl ?? null,
  };
}

export async function getAllMergedInstructors(): Promise<MergedInstructor[]> {
  const overlays = await db.select().from(instructorProfiles);
  const overlayBySlug = new Map(overlays.map((o) => [o.slug, o]));

  return instructors.map((base) => {
    const overlay = overlayBySlug.get(base.slug);
    return {
      ...base,
      name: overlay?.name || base.name,
      bio: overlay?.bio || base.bio,
      specialties:
        splitSpecialties(overlay?.specialties ?? null) ?? base.specialties,
      photoUrl: overlay?.photoUrl ?? null,
      videoUrl: overlay?.videoUrl ?? null,
    };
  });
}
