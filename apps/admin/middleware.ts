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
         *  - Next.js internals (_next/*) and static files
         */
        "/((?!sign-in|api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
