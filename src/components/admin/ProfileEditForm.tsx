"use client";

import { useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

interface Props {
  slug: string;
  initialName: string;
  initialBio: string;
  initialSpecialties: string;
  initialPhotoUrl: string | null;
  initialVideoUrl: string | null;
}

export default function ProfileEditForm({
  slug,
  initialName,
  initialBio,
  initialSpecialties,
  initialPhotoUrl,
  initialVideoUrl,
}: Props) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [specialties, setSpecialties] = useState(initialSpecialties);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploadingPhoto(true);
    try {
      const blob = await upload(`photos/${slug}-${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/profile/upload",
      });
      setPhotoUrl(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploadingVideo(true);
    setVideoProgress(0);
    try {
      const blob = await upload(`videos/${slug}-${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/profile/upload",
        onUploadProgress: ({ percentage }) => setVideoProgress(percentage),
      });
      setVideoUrl(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          bio,
          specialties,
          photoUrl,
          videoUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }

      setSavedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {savedAt && !error && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg">
          Profile saved at {savedAt.toLocaleTimeString()}.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialties
          </label>
          <textarea
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            rows={4}
            placeholder="One per line, e.g.&#10;Freestyle & Backstroke&#10;Dives & Turns"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
          />
          <p className="text-xs text-gray-400 mt-1">
            One specialty per line. These appear as tags on the profile page.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-heading font-semibold text-navy">Profile Photo</h2>

        <div className="flex items-start gap-5">
          <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-turquoise to-blue flex items-center justify-center text-white text-3xl font-heading font-bold relative">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Current photo"
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              name[0]
            )}
          </div>

          <div className="flex-1">
            <label className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors">
              {uploadingPhoto ? "Uploading..." : photoUrl ? "Replace Photo" : "Upload Photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>
            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl(null)}
                className="ml-2 text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            )}
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG, or WebP. Max 10MB. Square images work best.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="font-heading font-semibold text-navy">Intro Video</h2>

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="w-full max-w-md rounded-lg bg-black"
          />
        )}

        <div>
          <label className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg cursor-pointer text-sm transition-colors">
            {uploadingVideo
              ? `Uploading ${Math.round(videoProgress)}%`
              : videoUrl
              ? "Replace Video"
              : "Upload Video"}
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleVideoUpload}
              disabled={uploadingVideo}
              className="hidden"
            />
          </label>
          {videoUrl && !uploadingVideo && (
            <button
              type="button"
              onClick={() => setVideoUrl(null)}
              className="ml-2 text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          )}
          <p className="text-xs text-gray-400 mt-2">
            MP4, MOV, or WebM. Max 200MB. Shown on the public profile page.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploadingPhoto || uploadingVideo}
          className="bg-turquoise hover:bg-turquoise-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {(uploadingPhoto || uploadingVideo) && (
          <span className="text-sm text-gray-500">
            Wait for upload to finish before saving.
          </span>
        )}
      </div>
    </form>
  );
}
