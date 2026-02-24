import { NextRequest, NextResponse } from 'next/server';
import { cloudinary, GALLERIES, type Gallery } from '../../../lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const password = formData.get('password') as string;
  const gallery = formData.get('gallery') as string;
  const file = formData.get('file') as File | null;

  // Auth check
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate gallery
  if (!GALLERIES.includes(gallery as Gallery)) {
    return NextResponse.json({ error: 'Invalid gallery' }, { status: 400 });
  }

  // Validate file
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
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
