export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/barbecue/:path*'],
  // matcher: ["/((?!register|api|login).*)"],
}
