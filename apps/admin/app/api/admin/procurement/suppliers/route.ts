import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { Prisma, prisma, logAudit } from "@furnitrack/db"
import { getAuthenticatedAppUser } from "@/lib/auth/session"

function buildRedirect(request: Request, message: string, tone: "success" | "error") {
  const url = new URL("/operations", request.url)
  url.searchParams.set("tab", "procurement")
  url.searchParams.set("message", message)
  url.searchParams.set("tone", tone)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: Request) {
  const currentUser = await getAuthenticatedAppUser()
  if (!currentUser || !["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)) {
    return buildRedirect(request, "Only operations or executive admins can manage suppliers.", "error")
  }

  const requestOrigin = request.headers.get("origin")
  const appOrigin = new URL(request.url).origin
  if (requestOrigin && requestOrigin !== appOrigin) {
    return buildRedirect(request, "Invalid request origin.", "error")
  }

  const formData = await request.formData()
  const action = String(formData.get("action") ?? "").trim()

  try {
    // ── CREATE / UPDATE SUPPLIER ─────────────────────────────────────────────
    if (action === "create" || action === "update") {
      const supplierId = action === "update" ? String(formData.get("supplierId") ?? "").trim() : null
      const name = String(formData.get("name") ?? "").trim()
      const contactPerson = String(formData.get("contactPerson") ?? "").trim() || null
      const email = String(formData.get("email") ?? "").trim() || null
      const phone = String(formData.get("phone") ?? "").trim() || null
      const notes = String(formData.get("notes") ?? "").trim() || null

      if (!name) return buildRedirect(request, "Supplier name is required.", "error")

      if (action === "create") {
        const newId = randomUUID()
        await prisma.$executeRaw(Prisma.sql`
          INSERT INTO public.suppliers (id, name, "contactPerson", email, phone, notes, "isActive", "createdAt", "updatedAt")
          VALUES (${newId}, ${name}, ${contactPerson}, ${email}, ${phone}, ${notes}, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `)
        await logAudit({
          actorId: currentUser.authUserId,
          action: "PRODUCT_UPDATED",
          entityType: "PRODUCT",
          entityId: newId,
          metadata: { auditLabel: "SUPPLIER_CREATED", name, contactPerson, phone, email },
        })
        revalidatePath("/operations")
        return buildRedirect(request, `Supplier "${name}" added.`, "success")
      }

      if (supplierId) {
        await prisma.$executeRaw(Prisma.sql`
          UPDATE public.suppliers
          SET name = ${name}, "contactPerson" = ${contactPerson}, email = ${email},
              phone = ${phone}, notes = ${notes}, "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = ${supplierId}
        `)
        await logAudit({
          actorId: currentUser.authUserId,
          action: "PRODUCT_UPDATED",
          entityType: "PRODUCT",
          entityId: supplierId,
          metadata: { auditLabel: "SUPPLIER_UPDATED", name, contactPerson, phone, email },
        })
        revalidatePath("/operations")
        return buildRedirect(request, `Supplier "${name}" updated.`, "success")
      }
    }

    // ── TOGGLE ACTIVE ────────────────────────────────────────────────────────
    if (action === "toggle") {
      const supplierId = String(formData.get("supplierId") ?? "").trim()
      const current = await prisma.$queryRaw<Array<{ name: string; isActive: boolean }>>(Prisma.sql`
        SELECT name, "isActive" FROM public.suppliers WHERE id = ${supplierId} LIMIT 1
      `)
      const currentName = current[0]?.name ?? ""
      const newStatus = !(current[0]?.isActive ?? true)
      await prisma.$executeRaw(Prisma.sql`
        UPDATE public.suppliers SET "isActive" = NOT "isActive", "updatedAt" = CURRENT_TIMESTAMP WHERE id = ${supplierId}
      `)
      await logAudit({
        actorId: currentUser.authUserId,
        action: "PRODUCT_UPDATED",
        entityType: "PRODUCT",
        entityId: supplierId,
        metadata: { auditLabel: newStatus ? "SUPPLIER_ACTIVATED" : "SUPPLIER_DEACTIVATED", name: currentName },
      })
      revalidatePath("/operations")
      return buildRedirect(request, `Supplier "${currentName}" ${newStatus ? "activated" : "deactivated"}.`, "success")
    }

    // ── ADD ADDRESS ──────────────────────────────────────────────────────────
    if (action === "add-address") {
      const supplierId = String(formData.get("supplierId") ?? "").trim()
      const label = String(formData.get("label") ?? "").trim() || null
      const address = String(formData.get("address") ?? "").trim()
      const city = String(formData.get("city") ?? "").trim() || null
      const province = String(formData.get("province") ?? "").trim() || null
      const isMain = formData.get("isMain") === "on"

      if (!address) return buildRedirect(request, "Address is required.", "error")

      if (isMain) {
        await prisma.$executeRaw(Prisma.sql`
          UPDATE public.supplier_addresses SET "isMain" = false WHERE "supplierId" = ${supplierId}
        `)
      }
      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO public.supplier_addresses (id, "supplierId", label, address, city, province, "isMain", "createdAt", "updatedAt")
        VALUES (${randomUUID()}, ${supplierId}, ${label}, ${address}, ${city}, ${province}, ${isMain}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      revalidatePath("/operations")
      return buildRedirect(request, "Address added.", "success")
    }

    // ── DELETE ADDRESS ───────────────────────────────────────────────────────
    if (action === "delete-address") {
      const addressId = String(formData.get("addressId") ?? "").trim()
      await prisma.$executeRaw(Prisma.sql`DELETE FROM public.supplier_addresses WHERE id = ${addressId}`)
      revalidatePath("/operations")
      return buildRedirect(request, "Address removed.", "success")
    }

    // ── ADD PRODUCT ──────────────────────────────────────────────────────────
    if (action === "add-product") {
      const supplierId = String(formData.get("supplierId") ?? "").trim()
      const materialStockId = String(formData.get("materialStockId") ?? "").trim() || null
      const materialName = String(formData.get("materialName") ?? "").trim()
      const unitCostRaw = parseFloat(String(formData.get("unitCost") ?? ""))
      const unitCost = Number.isFinite(unitCostRaw) && unitCostRaw > 0 ? unitCostRaw : null
      const unitOfMeasure = String(formData.get("unitOfMeasure") ?? "").trim() || null
      const notes = String(formData.get("notes") ?? "").trim() || null

      if (!materialName) return buildRedirect(request, "Material name is required.", "error")

      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO public.supplier_products (id, "supplierId", "materialStockId", "materialName", "unitCost", "unitOfMeasure", notes, "createdAt", "updatedAt")
        VALUES (${randomUUID()}, ${supplierId}, ${materialStockId}, ${materialName}, ${unitCost != null ? new Prisma.Decimal(unitCost) : null}, ${unitOfMeasure}, ${notes}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `)
      revalidatePath("/operations")
      return buildRedirect(request, `Material "${materialName}" added to supplier.`, "success")
    }

    // ── DELETE PRODUCT ───────────────────────────────────────────────────────
    if (action === "delete-product") {
      const productId = String(formData.get("productId") ?? "").trim()
      await prisma.$executeRaw(Prisma.sql`DELETE FROM public.supplier_products WHERE id = ${productId}`)
      revalidatePath("/operations")
      return buildRedirect(request, "Material removed from supplier.", "success")
    }

    return buildRedirect(request, "Invalid action.", "error")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save supplier data."
    return buildRedirect(request, message, "error")
  }
}
