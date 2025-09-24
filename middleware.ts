// middleware.ts
import { NextResponse } from "next/server";
export function middleware() {
  return NextResponse.next();
}
// (optional) keep your old matcher if you had one
// export const config = { matcher: ["/protected/:path*"] };
