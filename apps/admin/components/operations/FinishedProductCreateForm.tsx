"use client"

import { useMemo, useRef, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ImageDropField } from "./ImageDropField"
import { MaterialSelector } from "./MaterialSelector"
import { ColorVariantsEditor } from "./ColorVariantsEditor"

type RawMaterial = {
  id: string
  sku: string
  itemName: string
  availableQty: number
  unitOfMeasure: string
}

type Warehouse = {
  id: string
  name: string
  code: string
}

type FinishedProductDraft = {
  id: string
  name: string
  category: string
  warehouseId: string
  price: string
  description: string
  openingQty: number
  reorderThreshold: number
  widthCm: number
  depthCm: number
  heightCm: number
  weightKg: number
  unitOfMeasure: string
  badge: string
  imageUrl: string
  isPublished: boolean
  colorVariants: Array<{ name: string; hex: string; sku: string }>
  materials: Array<{ id: string; quantityDisplay: string; notes: string }>
  savedAt: string
}

type FinishedProductCreateFormProps = {
  rawMaterials: RawMaterial[]
  warehouses: Warehouse[]
  categories: string[]
}

function readTextValue(formData: FormData, key: string): string {
  const value = formData.get(key)
  if (value && typeof value === "string") return value.trim()
  return ""
}

export function FinishedProductCreateForm({
  rawMaterials,
  warehouses,
  categories,
}: FinishedProductCreateFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const draftIdParam = searchParams.get("draftId")
  
  const [drafts, setDrafts] = useState<FinishedProductDraft[]>([])
  const [draftMessage, setDraftMessage] = useState<string | null>(null)
  const createFormRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    fetch("/api/admin/operations/products/drafts", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load finished product drafts.")
        return response.json()
      })
      .then((data) => {
        setDrafts(Array.isArray(data.drafts) ? data.drafts : [])
      })
      .catch(() => {
        setDraftMessage("Drafts could not be loaded from your account.")
      })
  }, [])

  const activeDraft = useMemo(
    () => drafts.find((draft) => draft.id === draftIdParam) ?? null,
    [draftIdParam, drafts]
  )

  const draftSelectedIds = activeDraft?.materials.map((m) => m.id) ?? []
  const draftQuantities = Object.fromEntries(
    activeDraft?.materials.map((m) => [m.id, m.quantityDisplay]) ?? []
  )
  const draftNotes = Object.fromEntries(
    activeDraft?.materials.map((m) => [m.id, m.notes]) ?? []
  )

  const [previewImageUrl, setPreviewImageUrl] = useState<string>("")

  // Sync preview when activeDraft loads asynchronously
  useEffect(() => {
    if (activeDraft?.imageUrl) {
      setPreviewImageUrl(activeDraft.imageUrl)
    }
  }, [activeDraft])

  const handleImageChange = useCallback((url: string) => {
    setPreviewImageUrl(url)
  }, [])

  function collectDraftFromForm(form: HTMLFormElement): FinishedProductDraft {
    const formData = new FormData(form)
    
    const materialIds = Array.from(formData.keys())
      .filter((k) => k.startsWith("quantityDisplay:"))
      .map((k) => k.split(":")[1])
      .filter(Boolean)

    let parsedVariants = activeDraft?.colorVariants ?? []
    const variantsRaw = formData.get("colorVariants")
    if (variantsRaw && typeof variantsRaw === "string") {
      try {
        parsedVariants = JSON.parse(variantsRaw)
      } catch (e) {
        // ignore
      }
    }

    return {
      id: formData.get("draftId")?.toString() ?? crypto.randomUUID(),
      name: readTextValue(formData, "name"),
      category: readTextValue(formData, "category"),
      warehouseId: readTextValue(formData, "warehouseId"),
      price: readTextValue(formData, "price"),
      description: readTextValue(formData, "description"),
      openingQty: Number(formData.get("openingQty")) || 0,
      reorderThreshold: Number(formData.get("reorderThreshold")) || 0,
      widthCm: Number(formData.get("widthCm")) || 0,
      depthCm: Number(formData.get("depthCm")) || 0,
      heightCm: Number(formData.get("heightCm")) || 0,
      weightKg: Number(formData.get("weightKg")) || 0,
      unitOfMeasure: readTextValue(formData, "unitOfMeasure"),
      badge: readTextValue(formData, "badge"),
      imageUrl: readTextValue(formData, "imageUrl"),
      isPublished: formData.get("isPublished") === "on",
      colorVariants: parsedVariants,
      savedAt: new Date().toISOString(),
      materials: materialIds.map((id) => ({
        id,
        quantityDisplay: readTextValue(formData, `quantityDisplay:${id}`),
        notes: readTextValue(formData, `notes:${id}`),
      })),
    }
  }

  async function saveCreateDraft() {
    const form = createFormRef.current
    if (!form) return

    const nextDraft = collectDraftFromForm(form)

    setDraftMessage("Saving draft...")

    try {
      const response = await fetch("/api/admin/operations/products/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: nextDraft }),
      })

      if (!response.ok) {
        throw new Error("Could not save draft.")
      }

      setDraftMessage("Draft saved successfully!")
      router.push("/operations?tab=finished-products")
    } catch {
      setDraftMessage("Failed to save draft.")
    }
  }

  return (
    <form
      ref={createFormRef}
      method="post"
      action="/api/admin/operations/products/create"
      className="flex flex-col gap-8"
    >
      {rawMaterials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#fca5a5] bg-[#fff7f7] p-6 text-[14px] text-[#b91c1c]">
          No raw materials exist in inventory yet, so finished products cannot be created. Add the needed
          materials in Inventory first.
        </div>
      ) : null}

      {draftMessage && (
        <div className="rounded-xl border border-[#bae6fd] bg-[#eff6ff] p-4 text-[13px] text-[#0369a1]">
          {draftMessage}
        </div>
      )}

      {activeDraft ? <input type="hidden" name="draftId" value={activeDraft.id} /> : null}

      {/* Image Preview */}
      {previewImageUrl && (
        <div className="rounded-[24px] border border-[#e2e8f0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#faf5ff] text-[#a855f7]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-[#0f172a]">Image preview</h3>
          </div>
          <div className="relative w-full overflow-hidden rounded-2xl border border-[#f1f5f9] bg-[#f8fafc]">
            <div className="relative aspect-[16/9] w-full max-h-[360px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImageUrl}
                alt="Product image preview"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <p className="mt-3 text-[12px] text-[#94a3b8]">
            This is how the product image will appear on the storefront.
          </p>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Left column: Catalog details (no container) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0fdf4] text-[#16a34a]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-[16px] font-bold text-[#0f172a]">Catalog details</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="grid gap-2 outline-none">
              <span className="text-[13px] font-semibold text-[#475569]">Product name <span className="text-red-500">*</span></span>
              <input
                name="name"
                required
                defaultValue={activeDraft?.name ?? ""}
                placeholder="e.g. Executive desk"
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
              />
            </label>
            <label className="grid gap-2 outline-none">
              <span className="text-[13px] font-semibold text-[#475569]">Storefront category <span className="text-red-500">*</span></span>
              <select
                name="category"
                defaultValue={activeDraft?.category ?? categories[0]}
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 outline-none">
              <span className="text-[13px] font-semibold text-[#475569]">Warehouse location <span className="text-red-500">*</span></span>
              <select
                name="warehouseId"
                defaultValue={activeDraft?.warehouseId ?? warehouses[0]?.id ?? ""}
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.code})
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 outline-none">
              <span className="text-[13px] font-semibold text-[#475569]">Selling price (₱) <span className="text-red-500">*</span></span>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={activeDraft?.price ?? ""}
                placeholder="0.00"
                className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
              />
            </label>
            <label className="md:col-span-2 grid gap-2 outline-none">
              <span className="text-[13px] font-semibold text-[#475569]">Product description <span className="text-red-500">*</span></span>
              <textarea
                name="description"
                rows={4}
                required
                defaultValue={activeDraft?.description ?? ""}
                placeholder="Describe the finished product's features, material, and dimensions to appear in the storefront."
                className="w-full resize-none rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
              />
            </label>
            <label className="md:col-span-2 grid gap-2">
              <span className="text-[13px] font-semibold text-[#475569]">Product image</span>
              <ImageDropField name="imageUrl" defaultValue={activeDraft?.imageUrl ?? ""} onChange={handleImageChange} />
            </label>
            <div className="md:col-span-2 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
              <ColorVariantsEditor
                defaultValue={activeDraft?.colorVariants ?? []}
                productMainSku={null}
              />
              <p className="mt-2 text-[11px] text-[#94a3b8]">
                The product's main SKU is auto-generated on create. Variant SKUs just need to be unique among themselves and not collide with other products' SKUs.
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Inventory + Material selection (no container) */}
        <div className="flex flex-col gap-8">
          {/* Inventory & Stock settings */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff6ff] text-[#0ea5e9]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-[16px] font-bold text-[#0f172a]">Inventory & Stock settings</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2 outline-none">
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">Opening stock</span>
                <input
                  name="openingQty"
                  type="number"
                  min="0"
                  defaultValue={activeDraft?.openingQty ?? 0}
                  className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                />
              </label>
              <label className="grid gap-2 outline-none">
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">Reorder threshold</span>
                <input
                  name="reorderThreshold"
                  type="number"
                  min="0"
                  defaultValue={activeDraft?.reorderThreshold ?? 10}
                  className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                />
              </label>
              <div className="md:col-span-2 grid grid-cols-3 gap-4">
                <label className="grid gap-2 outline-none">
                  <span className="text-[13px] font-semibold text-[#475569]">Width (cm)</span>
                  <input
                    name="widthCm"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={activeDraft?.widthCm ?? 0}
                    className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                  />
                </label>
                <label className="grid gap-2 outline-none">
                  <span className="text-[13px] font-semibold text-[#475569]">Depth (cm)</span>
                  <input
                    name="depthCm"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={activeDraft?.depthCm ?? 0}
                    className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                  />
                </label>
                <label className="grid gap-2 outline-none">
                  <span className="text-[13px] font-semibold text-[#475569]">Height (cm)</span>
                  <input
                    name="heightCm"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={activeDraft?.heightCm ?? 0}
                    className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                  />
                </label>
              </div>
              <label className="grid gap-2 outline-none">
                <span className="text-[13px] font-semibold text-[#475569]">Weight (kg)</span>
                <input
                  name="weightKg"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={activeDraft?.weightKg ?? 0}
                  className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                />
              </label>
              <label className="grid gap-2 outline-none">
                <span className="text-[13px] font-semibold text-[#475569]">Unit metric</span>
                <input
                  name="unitOfMeasure"
                  defaultValue={activeDraft?.unitOfMeasure ?? "pcs"}
                  placeholder="e.g. pcs, box, set"
                  className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                />
              </label>
              <label className="md:col-span-2 grid gap-2 outline-none">
                <span className="text-[13px] font-semibold text-[#475569]">Product badge (Optional)</span>
                <input
                  name="badge"
                  defaultValue={activeDraft?.badge ?? ""}
                  placeholder="e.g. NEW, BEST SELLER, 20% OFF"
                  className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                />
              </label>
            </div>

            <label className="mt-2 flex cursor-pointer items-start gap-4 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-4 transition-colors hover:border-[#0f172a] hover:bg-white">
              <div className="flex h-5 items-center">
                <input 
                  type="checkbox" 
                  name="isPublished" 
                  defaultChecked={activeDraft?.isPublished ?? true} 
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#0f172a] focus:ring-[#0f172a]" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#0f172a]">Publish immediately</span>
                <span className="text-[13px] text-[#64748b]">Product will be visible on the storefront right after creation.</span>
              </div>
            </label>
          </div>

          {/* Material Selection */}
          <MaterialSelector
            materials={rawMaterials}
            defaultSelectedIds={draftSelectedIds}
            defaultQuantities={draftQuantities}
            defaultNotes={draftNotes}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={() => router.push("/operations?tab=finished-products")}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-[#64748b] transition-all hover:bg-[#f1f5f9] hover:text-[#0f172a] focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={saveCreateDraft}
          className="inline-flex cursor-pointer appearance-none items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-6 py-3 text-[14px] font-semibold text-[#0f172a] transition-all hover:bg-[#f8fafc] hover:border-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:ring-offset-2 active:scale-95"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={rawMaterials.length === 0}
          className="inline-flex cursor-pointer appearance-none items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#1e293b] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0f172a]/50 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:bg-[#94a3b8]"
        >
          Create Product
        </button>
      </div>
    </form>
  )
}
