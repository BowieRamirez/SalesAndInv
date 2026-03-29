import { auth } from "@/lib/auth/server";

export default auth.middleware({
    // Redirect unauthenticated users to the admin sign-in page
    loginUrl: "/sign-in",
});

export const config = {
    matcher: [
        /*
         * Protect all admin dashboard routes.
         * Exclude:
         *  - /sign-in  (the login page itself)
         *  - /api/auth (Neon Auth handler routes)
         *  - /api/admin (custom admin route handlers do their own checks)
         *  - Next.js internals (_next/*) and static files
         */
        "/((?!sign-in|api/auth|api/admin|_next/static|_next/image|favicon.ico).*)",
    ],
};
