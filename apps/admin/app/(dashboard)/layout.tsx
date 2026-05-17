import { Sidebar } from "../../components/Sidebar";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";
import { getUnreadChatInquiryIds } from "@/lib/order-chat";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentUser = await requireAuthenticatedAppUser();
    
    // Only fetch unread count if the user is sales or a custom admin with potential access
    let unreadChatsCount = 0;
    if (["SALES", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
        const unreadSet = await getUnreadChatInquiryIds();
        unreadChatsCount = unreadSet.size;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar 
              currentUser={{ name: currentUser.name, role: currentUser.role, permissions: currentUser.permissions }} 
              unreadChatsCount={unreadChatsCount}
            />
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}
