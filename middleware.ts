/* middleware.ts ─ محافظت از / (صفحهٔ ادمین) با HTTP Basic Auth */
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/',           // فقط روت را می‌بندیم؛ بقیه صفحات عمومی‌اند
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const [, base64] = basicAuth.split(' ');
    const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');

    if (
      user === process.env.ADMIN_USER &&
      pass === process.env.ADMIN_PASS
    ) {
      return NextResponse.next();      // ✔️ اجازه عبور
    }
  }

  /* اگر نامعتبر یا خالی بود → چالش BasicAuth */
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
  });
}
