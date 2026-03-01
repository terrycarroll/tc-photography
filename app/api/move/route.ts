import { NextRequest, NextResponse } from 'next/server';
import { cloudinary, GALLERIES, type Gallery } from '../../../lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const { password, public_id, to_gallery } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!public_id || !String(public_id).startsWith('tc-photography/')) {
    return NextResponse.json({ error: 'Invalid photo' }, { status: 400 });
  }

  if (!to_gallery || !GALLERIES.includes(to_gallery as Gallery)) {
    return NextResponse.json({ error: 'Invalid gallery' }, { status: 400 });
  }

  // public_id format: tc-photography/{gallery}/{filename}
  const parts = String(public_id).split('/');
  const filename = parts[parts.length - 1];
  const new_public_id = `tc-photography/${to_gallery}/${filename}`;

  await cloudinary.uploader.rename(public_id, new_public_id);

  revalidatePath('/');
  return NextResponse.json({ ok: true, new_public_id });
}
