"use client"

import { useState } from "react"
import type { OrderChatMessage } from "@/lib/order-chat"

type AttachmentDraft = {
  fileName: string
  mimeType: string
  attachmentType: "IMAGE" | "DOCUMENT" | "QUOTATION" | "RECEIPT"
  dataUrl: string
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function OrderChatPanel({ inquiryId, messages }: { inquiryId: string; messages: OrderChatMessage[] }) {
  const [body, setBody] = useState("")
  const [attachmentType, setAttachmentType] = useState<AttachmentDraft["attachmentType"]>("IMAGE")
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([])
  const [isPreparing, setIsPreparing] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return

    setIsPreparing(true)
    const nextAttachments = await Promise.all(
      Array.from(files).slice(0, 3).map(async (file) => ({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        attachmentType: attachmentType === "IMAGE" && !file.type.startsWith("image/") ? "DOCUMENT" : attachmentType,
        dataUrl: await readFileAsDataUrl(file),
      })),
    )
    setAttachments(nextAttachments)
    setIsPreparing(false)
  }

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-[20px] font-semibold text-[#111827]">Order chat</h2>
        <p className="mt-1 text-[13px] text-[#6b7280]">This conversation is tied only to this specific order.</p>
      </div>

      <div className="max-h-[460px] space-y-3 overflow-y-auto rounded-2xl bg-[#f8fafc] p-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-8 text-center text-[13px] text-[#6b7280]">
            No chat messages yet.
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderRole === "SALES" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${message.senderRole === "SALES" ? "bg-[#111827] text-white" : "bg-white text-[#111827]"}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                  {message.senderRole === "SALES" ? "Sales" : message.senderName ?? "Customer"}
                </p>
                {message.body ? <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[22px]">{message.body}</p> : null}
                {message.attachments.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment) =>
                      attachment.mimeType.startsWith("image/") ? (
                        <a key={attachment.id} href={attachment.dataUrl} target="_blank" rel="noreferrer">
                          <img src={attachment.dataUrl} alt={attachment.fileName} className="max-h-56 rounded-xl border border-white/20 object-cover" />
                        </a>
                      ) : (
                        <a key={attachment.id} href={attachment.dataUrl} download={attachment.fileName} className="block rounded-xl border border-white/20 px-3 py-2 text-[12px] underline">
                          {attachment.attachmentType}: {attachment.fileName}
                        </a>
                      ),
                    )}
                  </div>
                ) : null}
                <p className="mt-2 text-[10px] opacity-60">{new Date(message.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form method="post" action="/api/admin/sales/order-chat" className="mt-4 space-y-3">
        <input type="hidden" name="inquiryId" value={inquiryId} />
        <input type="hidden" name="attachmentsJson" value={JSON.stringify(attachments)} />
        <textarea
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          placeholder="Reply to the customer about this order..."
          className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-colors focus:border-[#111827]"
        />
        <div className="grid gap-3 md:grid-cols-[180px_1fr_auto] md:items-end">
          <label className="grid gap-2">
            <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Attachment type</span>
            <select value={attachmentType} onChange={(event) => setAttachmentType(event.target.value as AttachmentDraft["attachmentType"])} className="rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#111827]">
              <option value="IMAGE">Image</option>
              <option value="DOCUMENT">Document</option>
              <option value="QUOTATION">Quotation</option>
              <option value="RECEIPT">Receipt</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">Images / documents</span>
            <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => void handleFiles(event.target.files)} className="w-full rounded-[14px] border border-[#d1d5dc] bg-white px-4 py-3 text-[13px] text-[#111827]" />
          </label>
          <button type="submit" disabled={isPreparing || (!body.trim() && attachments.length === 0)} className="rounded-[14px] bg-[#111827] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#9ca3af]">
            Send
          </button>
        </div>
        {attachments.length > 0 ? <p className="text-[12px] text-[#6b7280]">Prepared {attachments.length} attachment(s).</p> : null}
      </form>
    </div>
  )
}
