import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Handles client-side uploads to Vercel Blob. The browser calls this endpoint
 * first to get a one-time token, then uploads directly to Blob storage so the
 * file bytes never pass through this serverless function (avoids the 4.5MB
 * body limit that would otherwise cap video uploads).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const isVideo = pathname.startsWith("videos/");
        return {
          allowedContentTypes: isVideo
            ? ["video/mp4", "video/quicktime", "video/webm"]
            : ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {
        // The resulting URL is returned to the client; we persist it via the
        // PUT /api/admin/profile call that follows the upload.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
