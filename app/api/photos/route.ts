import { NextRequest, NextResponse } from 'next/server';
import { GALLERIES, type Gallery, getGalleryImageDetails } from '../../../lib/cloudinary';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');
  const gallery = searchParams.get('gallery');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!gallery || !GALLERIES.includes(gallery as Gallery)) {
    return NextResponse.json({ error: 'Invalid gallery' }, { status: 400 });
  }

  const images = await getGalleryImageDetails(gallery as Gallery);
  return NextResponse.json({ images });
}
