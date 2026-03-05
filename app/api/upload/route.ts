import { NextRequest, NextResponse } from 'next/server';
import { cloudinary, GALLERIES, type Gallery } from '../../../lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { checkAdminAuth } from '../../../lib/adminAuth';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const password = formData.get('password') as string;
  const gallery = formData.get('gallery') as string;
  const file = formData.get('file') as File | null;

  const authError = checkAdminAuth(req, password);
  if (authError) return authError;

  // Validate gallery
  if (!GALLERIES.includes(gallery as Gallery)) {
    return NextResponse.json({ error: 'Invalid gallery' }, { status: 400 });
  }

  // Validate file
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP and GIF files are allowed' }, { status: 400 });
  }

  const MAX_SIZE = 15 * 1024 * 1024; // 15MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File must be under 15MB' }, { status: 413 });
  }

  // Convert file to buffer for Cloudinary upload
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to Cloudinary with optimisation
  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `tc-photography/${gallery}`,
            // Cloudinary auto-optimises: converts to WebP, resizes, compresses
            transformation: [
              { width: 2000, height: 2000, crop: 'limit' }, // cap max dimension
              { quality: 'auto:good' },                      // smart compression
              { fetch_format: 'auto' },                      // best format for browser
            ],
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    }
  );

  // Revalidate the home page so the new image appears without a full redeploy
  revalidatePath('/');

  return NextResponse.json({ ok: true, url: result.secure_url });
}
