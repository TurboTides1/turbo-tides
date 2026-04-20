import { notFound } from "next/navigation";
import Link from "next/link";
import { getMergedInstructor } from "@/lib/instructor-profiles";
import { db } from "@/lib/db";
import { instructorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ProfileEditForm from "@/components/admin/ProfileEditForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditProfilePage({ params }: Props) {
  const { slug } = await params;
  const merged = await getMergedInstructor(slug);
  if (!merged) notFound();

  // Read the raw overlay so we can render the specialties textarea exactly as
  // the user last saved it (preserving blank lines / order), and only fall
  // back to the hardcoded default when there's no overlay row yet.
  const [overlay] = await db
    .select()
    .from(instructorProfiles)
    .where(eq(instructorProfiles.slug, slug));

  const specialtiesText =
    overlay?.specialties ?? merged.specialties.join("\n");

  return (
    <div>
      <Link
        href="/admin/profile"
        className="text-turquoise-dark hover:text-turquoise text-sm font-medium mb-4 inline-flex items-center gap-1 transition-colors"
      >
        &larr; All profiles
      </Link>

      <h1 className="text-2xl font-heading font-bold text-navy mb-6">
        Edit {merged.name}&apos;s Profile
      </h1>

      <ProfileEditForm
        slug={merged.slug}
        initialName={overlay?.name ?? merged.name}
        initialBio={overlay?.bio ?? merged.bio}
        initialSpecialties={specialtiesText}
        initialPhotoUrl={merged.photoUrl}
        initialVideoUrl={merged.videoUrl}
      />
    </div>
  );
}
