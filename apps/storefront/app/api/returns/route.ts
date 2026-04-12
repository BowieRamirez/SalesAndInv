import { Buffer } from "node:buffer"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { createReturnRequest } from "@furnitrack/db"
import { getStorefrontSessionUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/account/status", request.url)
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

async function fileToDataUrl(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString("base64")
  return `data:${file.type};base64,${base64}`
}

export async function POST(request: Request) {
  const currentUser = await getStorefrontSessionUser()

  if (!currentUser) {
    return buildRedirect(request, "Please sign in again before requesting a return.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin

  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const inquiryId = String(formData.get("inquiryId") ?? "").trim()
  const reason = String(formData.get("reason") ?? "").trim()
  const details = String(formData.get("details") ?? "").trim() || null
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, 4)

  if (!inquiryId || !reason) {
    return buildRedirect(request, "Return reason is required.", "error")
  }

  try {
    const imageUrls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return buildRedirect(request, "Only image files can be attached to a return request.", "error")
      }

      imageUrls.push(await fileToDataUrl(file))
    }

    await createReturnRequest({
      inquiryId,
      customerUserId: currentUser.id,
      reason,
      details,
      imageUrls,
    })

    revalidatePath("/account/status")
    revalidatePath("/sales")

    return buildRedirect(request, "Your return request has been submitted to sales.", "success")
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : "The return request could not be submitted."
    return buildRedirect(request, message, "error")
  }
}
