import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkAdminAuth } from '../../../lib/adminAuth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const authError = checkAdminAuth(req, password);
  if (authError) return authError;

  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
