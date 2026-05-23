"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { OrderChatMessage } from "@/lib/order-chat"
import { Image as ImageIcon, FileText, Receipt, Send, X } from "lucide-react"

type AttachmentDraft = {
  fileName: string
  mimeType: string
  attachmentType: "IMAGE" | "DOCUMENT" | "RECEIPT"
  dataUrl: string
}

type ChatPostResponse = {
  message?: string
  chatMessage?: OrderChatMessage
}

type ChatGetResponse = {
  message?: string
  messages?: OrderChatMessage[]
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function OrderChatPanel({
  inquiryId,
  messages,
  isClosed = false,
  contextNode,
  defaultOpen,
}: {
  inquiryId: string
  messages: OrderChatMessage[]
  isClosed?: boolean
  contextNode?: React.ReactNode
  defaultOpen?: boolean
}) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(defaultOpen ?? true)
  const [body, setBody] = useState("")
  const [attachmentType, setAttachmentType] = useState<AttachmentDraft["attachmentType"]>("IMAGE")
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([])
  const [localMessages, setLocalMessages] = useState(messages)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const refreshMessages = useCallback(async () => {
    const response = await fetch(`/api/admin/sales/order-chat?inquiryId=${encodeURIComponent(inquiryId)}`, {
      cache: "no-store",
      headers: {
        "x-requested-with": "fetch",
      },
    })
    const result = (await response.json().catch(() => ({}))) as ChatGetResponse

    if (!response.ok || !result.messages) {
      return
    }

    setLocalMessages(
      result.messages.map((message) => ({
        ...message,
        createdAt: new Date(message.createdAt),
      }))
    )
  }, [inquiryId])

  useEffect(() => {
    void refreshMessages()
    const interval = window.setInterval(() => {
      void refreshMessages()
    }, 3000)

    return () => window.clearInterval(interval)
  }, [refreshMessages])

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return

    setIsPreparing(true)
    // Clear the input value so selecting the same file again triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    const nextAttachments = await Promise.all(
      Array.from(files).map(async (file) => ({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        attachmentType: attachmentType === "IMAGE" && !file.type.startsWith("image/") ? "DOCUMENT" : attachmentType,
        dataUrl: await readFileAsDataUrl(file),
      })),
    )
    setAttachments(prev => [...prev, ...nextAttachments].slice(0, 5)) // Keep up to 5 attachments max
    setIsPreparing(false)
  }

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatusMessage("")

    if (!body.trim() && attachments.length === 0) {
      return
    }

    setIsSending(true)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      const response = await fetch("/api/admin/sales/order-chat", {
        method: "POST",
        body: formData,
        headers: {
          "x-requested-with": "fetch",
        },
      })
      const result = (await response.json().catch(() => ({}))) as ChatPostResponse

      if (!response.ok || !result.chatMessage) {
        setStatusMessage(result.message ?? "Message could not be sent. Please try again.")
        return
      }

      setLocalMessages((currentMessages) => [
        ...currentMessages,
        {
          ...result.chatMessage!,
          createdAt: new Date(result.chatMessage!.createdAt),
        },
      ])
      setBody("")
      setAttachments([])
      form.reset()
      setStatusMessage(result.message ?? "Message sent.")
      void refreshMessages()
      router.refresh()
    } catch {
      setStatusMessage("Message could not be sent. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={`flex h-full flex-col md:flex-row bg-white overflow-hidden ${contextNode ? 'min-h-[500px]' : ''}`}>
      <div className="flex-1 p-5 lg:p-6 flex flex-col relative w-full h-full min-h-0">
        <div className="mb-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[20px] font-semibold text-[#111827]">Order chat</h2>
            <p className="mt-1 text-[13px] text-[#6b7280]">This conversation is tied only to this specific order.</p>
          </div>
          {contextNode && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors shrink-0 text-gray-500"
              aria-label="Toggle context panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-[#f8fafc] p-4 min-h-0">
        {localMessages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-8 text-center text-[13px] text-[#6b7280]">
            No chat messages yet.
          </div>
        ) : (
          localMessages.map((message) => (
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
                      ) : attachment.mimeType === "application/pdf" ? (
                        <a
                          key={attachment.id}
                          href={attachment.dataUrl}
                          download={attachment.fileName}
                          className={`flex items-center gap-2.5 rounded-[12px] border px-3 py-2.5 text-[12px] font-medium transition-colors ${
                            message.senderRole === "CLIENT"
                              ? "border-white/20 text-white hover:bg-white/10"
                              : "border-[#e5e7eb] bg-[#f8fafc] text-[#374151] hover:bg-[#f1f5f9]"
                          }`}
                        >
                          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <span className="truncate">{attachment.fileName}</span>
                          <svg className="h-3.5 w-3.5 shrink-0 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
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

      {isClosed ? (
        <div className="mt-4 rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] p-6 text-center text-[13px] text-[#6b7280] shrink-0">
          This order has been completed. The chat is now closed.
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="mt-4 shrink-0">
          <input type="hidden" name="inquiryId" value={inquiryId} />
          <input type="hidden" name="attachmentsJson" value={JSON.stringify(attachments)} />

          <div className="relative flex flex-col rounded-[16px] border border-[#d1d5dc] bg-white shadow-sm transition-colors focus-within:border-[#111827]">
            <textarea
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={3}
              placeholder="Reply to the customer about this order..."
              className="w-full resize-none bg-transparent px-4 py-3 text-[14px] text-[#111827] outline-none"
            />
            
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-2 py-1 text-[12px] text-[#4b5563]">
                    <span className="max-w-[120px] truncate">{att.fileName}</span>
                    <button type="button" onClick={() => setAttachments(attachments.filter((_, index) => index !== i))} className="text-[#9ca3af] hover:text-[#4b5563]">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#f3f4f6] px-3 py-2">
              <div className="flex items-center gap-1">
                <label className="relative cursor-pointer rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6]" title="Attach Image">
                  <ImageIcon className="h-5 w-5" />
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(event) => { setAttachmentType("IMAGE"); void handleFiles(event.target.files) }} className="hidden" />
                </label>
                <label className="relative cursor-pointer rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6]" title="Attach Document">
                  <FileText className="h-5 w-5" />
                  <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => { setAttachmentType("DOCUMENT"); void handleFiles(event.target.files) }} className="hidden" />
                </label>
                <label className="relative cursor-pointer rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6]" title="Attach Receipt">
                  <Receipt className="h-5 w-5" />
                  <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" onChange={(event) => { setAttachmentType("RECEIPT"); void handleFiles(event.target.files) }} className="hidden" />
                </label>
              </div>

              <button type="submit" disabled={isPreparing || isSending || (!body.trim() && attachments.length === 0)} className="flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#9ca3af]">
                <span>{isSending ? "Sending..." : "Send"}</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          {statusMessage ? <p className="mt-2 text-[12px] text-[#6b7280]">{statusMessage}</p> : null}
        </form>
      )}
      </div>

      {contextNode && isExpanded && (
        <div className="w-full md:w-[320px] lg:w-[380px] shrink-0 border-t border-[#e5e7eb] md:border-t-0 md:border-l bg-[#f9fafb] p-5 lg:p-6 overflow-y-auto">
          {contextNode}
        </div>
      )}
    </div>
  )
}
