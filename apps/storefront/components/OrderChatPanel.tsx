import Link from "next/link"
import { MessageSquare } from "lucide-react"
import type { OrderChatMessage } from "@/lib/order-chat"

/**
 * "Chat about this order" entry point on the My Orders page.
 *
 * Originally a side-drawer panel, this now navigates to the dedicated
 * `/account/chat/[inquiryId]` page so the seller-client conversation
 * has a full-page workspace.
 *
 * The `messages`, `defaultOpen`, and `contextNode` props are accepted for
 * backwards compatibility with the existing call sites — they are unused.
 */
export function OrderChatPanel({
  inquiryId,
  messages,
}: {
  inquiryId: string
  messages?: OrderChatMessage[]
  defaultOpen?: boolean
  contextNode?: React.ReactNode
}) {
  const unreadCount = messages?.length ?? 0

  return (
    <div className="flex justify-end">
      <Link
        href={`/account/chat/${inquiryId}`}
        className="inline-flex items-center gap-2 rounded-[14px] bg-[#1a1a2e] px-5 py-3 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#2a2a44]"
      >
        <MessageSquare className="h-4 w-4" />
        Chat about this order
        {unreadCount > 0 ? (
          <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#c9a96e] px-1.5 text-[11px] font-semibold text-[#1a1a2e]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </Link>
    </div>
  )
}
