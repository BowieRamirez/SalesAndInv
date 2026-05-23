"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FileText, Image as ImageIcon, Send, X } from "lucide-react"
import type { OrderChatMessage } from "@/lib/order-chat"

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

function formatMessageDate(value: Date | string) {
  return new Date(value).toISOString().slice(0, 16).replace("T", " ")
}

export function OrderChatThread({
  inquiryId,
  initialMessages,
}: {
  inquiryId: string
  initialMessages: OrderChatMessage[]
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [body, setBody] = useState("")
  const [attachments, setAttachments] = useState<AttachmentDraft[]>([])
  const [attachmentType, setAttachmentType] = useState<AttachmentDraft["attachmentType"]>("IMAGE")
  const [isPreparing, setIsPreparing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const refreshMessages = useCallback(async () => {
    const response = await fetch(`/api/order-chat?inquiryId=${encodeURIComponent(inquiryId)}`, {
      cache: "no-store",
      headers: { "x-requested-with": "fetch" },
    })
    const result = (await response.json().catch(() => ({}))) as ChatGetResponse
    if (!response.ok || !result.messages) return
    setMessages(result.messages.map((m) => ({ ...m, createdAt: new Date(m.createdAt) })))
  }, [inquiryId])

  // Poll for new messages every 3s
  useEffect(() => {
    void refreshMessages()
    const interval = window.setInterval(() => {
      void refreshMessages()
    }, 3000)
    return () => window.clearInterval(interval)
  }, [refreshMessages])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setIsPreparing(true)
    if (fileInputRef.current) fileInputRef.current.value = ""
    const next = await Promise.all(
      Array.from(files).map(async (file) => ({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        attachmentType:
          attachmentType === "IMAGE" && !file.type.startsWith("image/")
            ? ("DOCUMENT" as const)
            : attachmentType,
        dataUrl: await readFileAsDataUrl(file),
      })),
    )
    setAttachments((prev) => [...prev, ...next].slice(0, 5))
    setIsPreparing(false)
  }

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatusMessage("")
    if (!body.trim() && attachments.length === 0) return

    setIsSending(true)
    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      const response = await fetch("/api/order-chat", {
        method: "POST",
        body: formData,
        headers: { "x-requested-with": "fetch" },
      })
      const result = (await response.json().catch(() => ({}))) as ChatPostResponse
      if (!response.ok || !result.chatMessage) {
        setStatusMessage(result.message ?? "Message could not be sent. Please try again.")
        return
      }
      setMessages((prev) => [
        ...prev,
        { ...result.chatMessage!, createdAt: new Date(result.chatMessage!.createdAt) },
      ])
      setBody("")
      setAttachments([])
      form.reset()
      void refreshMessages()
    } catch {
      setStatusMessage("Message could not be sent. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="flex h-[70vh] min-h-[520px] flex-col overflow-hidden border border-[#e5e7eb] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#99a1af]">Conversation</p>
          <h2 className="mt-1 text-[16px] font-semibold text-[#1a1a2e]">Sales &amp; you</h2>
        </div>
        <span className="inline-flex items-center gap-2 border border-[#e5e7eb] px-3 py-1 text-[11px] font-medium text-[#6a7282]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="border border-dashed border-[#d1d5dc] bg-white px-5 py-12 text-center text-[13px] text-[#6a7282]">
              No messages yet. Send the first message to sales below.
            </div>
          ) : (
            messages.map((message) => {
              const isClient = message.senderRole === "CLIENT"
              return (
                <div key={message.id} className={`flex ${isClient ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] px-4 py-3 ${
                      isClient ? "bg-[#1a1a2e] text-white" : "bg-white text-[#1a1a2e] border border-[#e5e7eb]"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
                      {isClient ? "You" : "Sales"}
                    </p>
                    {message.body ? (
                      <p className="mt-1.5 whitespace-pre-wrap text-[13.5px] leading-[20px]">{message.body}</p>
                    ) : null}
                    {message.attachments.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment) =>
                          attachment.mimeType.startsWith("image/") ? (
                            <a key={attachment.id} href={attachment.dataUrl} target="_blank" rel="noreferrer">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={attachment.dataUrl}
                                alt={attachment.fileName}
                                className="max-h-60 border border-white/20 object-cover"
                              />
                            </a>
                          ) : attachment.mimeType === "application/pdf" ? (
                            <a
                              key={attachment.id}
                              href={attachment.dataUrl}
                              download={attachment.fileName}
                              className={`flex items-center gap-2.5 border px-3 py-2.5 text-[12px] font-medium transition-colors ${
                                isClient
                                  ? "border-white/20 text-white hover:bg-white/10"
                                  : "border-[#e5e7eb] bg-[#f8fafc] text-[#374151] hover:bg-[#f1f5f9]"
                              }`}
                            >
                              <FileText className="h-4 w-4 shrink-0" />
                              <span className="truncate">{attachment.fileName}</span>
                            </a>
                          ) : (
                            <a
                              key={attachment.id}
                              href={attachment.dataUrl}
                              download={attachment.fileName}
                              className="block border border-white/20 px-3 py-2 text-[12px] underline"
                            >
                              {attachment.attachmentType}: {attachment.fileName}
                            </a>
                          ),
                        )}
                      </div>
                    ) : null}
                    <p className="mt-2 text-[10px] opacity-60">{formatMessageDate(message.createdAt)}</p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <form onSubmit={handleSendMessage} className="border-t border-[#e5e7eb] bg-white px-5 py-4">
        <input type="hidden" name="inquiryId" value={inquiryId} />
        <input type="hidden" name="attachmentsJson" value={JSON.stringify(attachments)} />

        <div className="flex flex-col border border-[#d1d5dc] bg-white shadow-sm transition-colors focus-within:border-[#1a1a2e]">
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Write a message to sales…"
            className="w-full resize-none bg-transparent px-4 py-3 text-[14px] text-[#1a1a2e] outline-none"
          />

          {attachments.length > 0 ? (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 border border-[#e5e7eb] bg-[#f9fafb] px-2 py-1 text-[12px] text-[#4b5563]"
                >
                  <span className="max-w-[160px] truncate">{att.fileName}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                    className="text-[#9ca3af] hover:text-[#4b5563]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-[#f3f4f6] px-3 py-2">
            <div className="flex items-center gap-1">
              <label className="cursor-pointer p-2 text-[#6a7282] transition-colors hover:bg-[#f3f4f6]" title="Attach Image">
                <ImageIcon className="h-5 w-5" />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    setAttachmentType("IMAGE")
                    void handleFiles(e.target.files)
                  }}
                  className="hidden"
                />
              </label>
              <label className="cursor-pointer p-2 text-[#6a7282] transition-colors hover:bg-[#f3f4f6]" title="Attach Document">
                <FileText className="h-5 w-5" />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    setAttachmentType("DOCUMENT")
                    void handleFiles(e.target.files)
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isPreparing || isSending || (!body.trim() && attachments.length === 0)}
              className="inline-flex items-center gap-2 bg-[#c9a96e] px-4 py-2 text-[13px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#c9a96e]/90 disabled:cursor-not-allowed disabled:bg-[#ead8b6] disabled:opacity-70"
            >
              <span>{isSending ? "Sending…" : "Send"}</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        {statusMessage ? <p className="mt-2 text-[12px] text-[#6a7282]">{statusMessage}</p> : null}
      </form>
    </section>
  )
}
