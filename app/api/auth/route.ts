import { NextRequest } from 'next/server';
import { checkAdminAuth } from '../../../lib/adminAuth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const authError = checkAdminAuth(req, password);
  if (authError) return authError;
  return Response.json({ ok: true });
}
