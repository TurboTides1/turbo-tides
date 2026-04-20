import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { instructorProfiles } from "@/lib/db/schema";
import { getInstructor } from "@/lib/instructors";

/**
 * PUT /api/admin/profile
 * Upsert editable profile fields for an instructor. Any field may be null,
 * in which case the public site falls back to the hardcoded default.
 */
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { slug, name, bio, specialties, photoUrl, videoUrl } = body as {
    slug?: string;
    name?: string | null;
    bio?: string | null;
    specialties?: string | null;
    photoUrl?: string | null;
    videoUrl?: string | null;
  };

  if (!slug || !getInstructor(slug)) {
    return NextResponse.json({ error: "Invalid instructor" }, { status: 400 });
  }

  const now = new Date();
  const values = {
    slug,
    name: name?.trim() || null,
    bio: bio?.trim() || null,
    specialties: specialties?.trim() || null,
    photoUrl: photoUrl || null,
    videoUrl: videoUrl || null,
    updatedAt: now,
  };

  await db
    .insert(instructorProfiles)
    .values(values)
    .onConflictDoUpdate({
      target: instructorProfiles.slug,
      set: {
        name: values.name,
        bio: values.bio,
        specialties: values.specialties,
        photoUrl: values.photoUrl,
        videoUrl: values.videoUrl,
        updatedAt: values.updatedAt,
      },
    });

  return NextResponse.json({ success: true });
}
