import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '../../../lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const { password, public_id } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!public_id || !String(public_id).startsWith('tc-photography/')) {
    return NextResponse.json({ error: 'Invalid photo' }, { status: 400 });
  }

  const result = await cloudinary.uploader.destroy(public_id);

  if (result.result !== 'ok') {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }

  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
