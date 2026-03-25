import { Sidebar } from "../../components/Sidebar";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentUser = await requireAuthenticatedAppUser();

    return (
        <div className="flex min-h-screen">
            <Sidebar currentUser={{ name: currentUser.name, role: currentUser.role }} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {children}
            </div>
        </div>
    );
}
