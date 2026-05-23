import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { Prisma, prisma } from "@furnitrack/db"
import { ArrowLeft, MessageSquare, Package } from "lucide-react"
import { OrderChatThread } from "@/components/OrderChatThread"
import { getStorefrontSessionUser } from "@/lib/auth/session"
import { canCustomerAccessInquiry, getOrderChatMessages } from "@/lib/order-chat"

export const dynamic = "force-dynamic"

type InquiryContextRow = {
  id: string
  inquiryNumber: string | null
  productName: string
  productSlug: string | null
  status: string
  quotedPrice: string | null
  quotationRevisionCount: number | null
  createdAt: Date
}

type OtherChatRow = {
  id: string
  inquiryNumber: string | null
  productName: string
  status: string
  lastMessage: string | null
  lastMessageAt: Date | null
}

async function getOtherCustomerChats(customerUserId: string, currentInquiryId: string) {
  return prisma.$queryRaw<OtherChatRow[]>(Prisma.sql`
    SELECT
      ci.id,
      ci."inquiryNumber",
      p.name AS "productName",
      ci.status::text AS status,
      lm.body AS "lastMessage",
      lm.created_at AS "lastMessageAt"
    FROM public.customer_inquiries ci
    INNER JOIN public.products p ON p.id = ci."productId"
    LEFT JOIN LATERAL (
      SELECT body, created_at
      FROM public.order_chat_messages
      WHERE inquiry_id = ci.id
      ORDER BY created_at DESC
      LIMIT 1
    ) lm ON TRUE
    WHERE ci."customerUserId" = ${customerUserId}
      AND ci.id <> ${currentInquiryId}
    ORDER BY COALESCE(lm.created_at, ci."createdAt") DESC
    LIMIT 25
  `)
}

export default async function OrderChatPage({
  params,
}: {
  params: Promise<{ inquiryId: string }>
}) {
  const { inquiryId } = await params
  const sessionUser = await getStorefrontSessionUser()

  if (!sessionUser) {
    redirect(`/sign-in?redirect=${encodeURIComponent(`/account/chat/${inquiryId}`)}`)
  }

  const allowed = await canCustomerAccessInquiry(inquiryId, sessionUser.id)
  if (!allowed) {
    notFound()
  }

  const [rows, messages, otherChats] = await Promise.all([
    prisma.$queryRaw<InquiryContextRow[]>(Prisma.sql`
      SELECT
        ci.id,
        ci."inquiryNumber",
        p.name AS "productName",
        p.slug AS "productSlug",
        ci.status::text AS status,
        ci."quotedPrice"::text AS "quotedPrice",
        COALESCE(ci."quotationRevisionCount", 0)::int AS "quotationRevisionCount",
        ci."createdAt"
      FROM public.customer_inquiries ci
      INNER JOIN public.products p ON p.id = ci."productId"
      WHERE ci.id = ${inquiryId}
      LIMIT 1
    `),
    getOrderChatMessages(inquiryId),
    getOtherCustomerChats(sessionUser.id, inquiryId),
  ])

  const inquiry = rows[0]
  if (!inquiry) {
    notFound()
  }

  const formattedStatus = inquiry.status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase())
  const formattedDate = new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(inquiry.createdAt))

  function formatRelative(date: Date | null) {
    if (!date) return ""
    const now = Date.now()
    const diff = now - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(new Date(date))
  }

  function shortStatus(status: string) {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (m) => m.toUpperCase())
  }

  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-5 py-8 lg:py-10">
      {/* Back link */}
      <div>
        <Link
          href="/account/status"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6a7282] transition-colors hover:text-[#1a1a2e]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my orders
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* ─────────────  Sidebar  ───────────── */}
        <aside className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:order-1">
          <section className="flex min-h-0 flex-col overflow-hidden border border-[#e5e7eb] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#99a1af]">Other order chats</p>
                <h2 className="mt-1 text-[14px] font-semibold text-[#1a1a2e]">My orders</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 border border-[#e5e7eb] px-2.5 py-1 text-[11px] font-medium text-[#6a7282]">
                <MessageSquare className="h-3 w-3" />
                {otherChats.length}
              </span>
            </div>

            {otherChats.length === 0 ? (
              <div className="px-5 py-10 text-center text-[12px] text-[#9ca3af]">
                No other orders yet.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {otherChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/account/chat/${chat.id}`}
                    className="block border-b border-[#f3f4f6] px-5 py-3 transition-colors last:border-b-0 hover:bg-[#f8fafc]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-1 text-[13px] font-semibold text-[#1a1a2e]">{chat.productName}</p>
                      {chat.lastMessageAt ? (
                        <span className="shrink-0 text-[10px] text-[#9ca3af]">
                          {formatRelative(chat.lastMessageAt)}
                        </span>
                      ) : null}
                    </div>
                    {chat.inquiryNumber ? (
                      <p className="mt-0.5 font-mono text-[10px] text-[#9ca3af]">{chat.inquiryNumber}</p>
                    ) : null}
                    {chat.lastMessage ? (
                      <p className="mt-1.5 line-clamp-2 text-[12px] leading-[18px] text-[#6a7282]">
                        {chat.lastMessage}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-[12px] italic text-[#9ca3af]">No messages yet.</p>
                    )}
                    <span className="mt-2 inline-flex items-center border border-[#e5e7eb] bg-[#f9fafb] px-2 py-0.5 text-[10px] font-medium text-[#6a7282]">
                      {shortStatus(chat.status)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </aside>

        {/* ─────────────  Main column  ───────────── */}
        <div className="flex min-w-0 flex-col gap-5 lg:order-2">
          {/* Order context card */}
          <section className="overflow-hidden border border-[#e5e7eb] bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-4 px-6 py-5">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden border border-[#e5e7eb] bg-[#f8fafc] text-[#9ca3af]">
                <Package className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#99a1af]">Order chat</p>
                <h1 className="mt-1 font-[family-name:var(--font-inter)] text-[20px] font-semibold text-[#1a1a2e]">
                  {inquiry.productName}
                </h1>
                <p className="mt-0.5 text-[12px] text-[#6a7282]">
                  {inquiry.inquiryNumber ? `${inquiry.inquiryNumber} · ` : ""}
                  Placed {formattedDate}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-[12px] font-medium text-[#374151]">
                {formattedStatus}
              </span>
            </div>
          </section>

          {/* Chat thread */}
          <OrderChatThread inquiryId={inquiryId} initialMessages={messages} />
        </div>
      </div>
    </main>
  )
}
