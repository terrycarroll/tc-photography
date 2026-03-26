import { NextRequest, NextResponse } from 'next/server';
import { cloudinary, GALLERIES, type Gallery } from '../../../lib/cloudinary';
import { checkAdminAuth } from '../../../lib/adminAuth';

export async function POST(req: NextRequest) {
  const { password, gallery } = await req.json();

  const authError = checkAdminAuth(req, password);
  if (authError) return authError;

  if (!GALLERIES.includes(gallery as Gallery)) {
    return NextResponse.json({ error: 'Invalid gallery' }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `tc-photography/${gallery}`;

  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
