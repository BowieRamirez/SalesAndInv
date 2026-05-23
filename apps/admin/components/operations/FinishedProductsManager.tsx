"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { ImageDropField } from "./ImageDropField"
import { MaterialSelector } from "./MaterialSelector"
import { ColorVariantsEditor } from "./ColorVariantsEditor"

type FinishedProduct = {
  id: string
  productStockId: string
  name: string
  category: string
  price: number
  badge: string | null
  description: string
  isPublished: boolean
  state: string
  imageUrl: string
  warehouseName: string
  sku: string
  availableQty: number
  reorderThreshold: number
  materialSummary: string
  recipeCount: number
  recipeDetails: Array<{
    id: string
    itemName: string
    sku: string
    quantityDisplay: string | null
    notes: string | null
  }>
  colorVariants: Array<{ name: string; hex: string; sku: string }>
}

type FinishedProductsManagerProps = {
  products: FinishedProduct[]
  rawMaterials: Array<{
    id: string
    sku: string
    itemName: string
    availableQty: number
    unitOfMeasure: string
  }>
  warehouses: Array<{
    id: string
    name: string
    code: string
  }>
  categories: readonly string[]
  isArchivedView?: boolean
  userRole?: string
}

type FinishedProductDraftMaterial = {
  id: string
  quantityDisplay: string
  notes: string
}

type FinishedProductDraft = {
  id: string
  savedAt: string
  name: string
  category: string
  warehouseId: string
  price: string
  imageUrl: string
  description: string
  openingQty: string
  reorderThreshold: string
  widthCm: string
  depthCm: string
  heightCm: string
  weightKg: string
  unitOfMeasure: string
  badge: string
  isPublished: boolean
  materials: FinishedProductDraftMaterial[]
  colorVariants?: Array<{ name: string; hex: string; sku: string }>
}

function formatPeso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value)
}

function DescriptionBlock({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  // Rough character threshold — descriptions under ~300 chars don't need a toggle
  const isLong = text.length > 300
  return (
    <dd className="mt-2">
      <p
        className={`whitespace-pre-wrap text-[14px] leading-6 text-[#334155] transition-all ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[12px] font-semibold text-[#6366f1] hover:underline"
        >
          {expanded ? "Show less" : "Show full description"}
        </button>
      )}
    </dd>
  )
}

const PAGE_SIZE = 10

function readTextValue(formData: FormData, name: string, fallback = "") {
  return String(formData.get(name) ?? fallback).trim()
}

function formatDraftTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Draft"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function FinishedProductsManager({ products, rawMaterials, warehouses, categories, isArchivedView, userRole }: FinishedProductsManagerProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [openProductId, setOpenProductId] = useState<string | null>(null)
  const [editProductId, setEditProductId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditConfirm, setShowEditConfirm] = useState(false)
  const [drafts, setDrafts] = useState<FinishedProductDraft[]>([])
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null)
  const [createFormVersion, setCreateFormVersion] = useState(0)
  const [draftMessage, setDraftMessage] = useState<string | null>(null)
  const createFormRef = useRef<HTMLFormElement>(null)
  const deferredSearch = useDeferredValue(search)

  // ADMIN_MANAGEMENT can edit directly; OPERATIONS_DESIGN submits for approval
  const isExecutiveAdmin = userRole === "ADMIN_MANAGEMENT"

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === openProductId) ?? null,
    [openProductId, products],
  )

  const editProduct = useMemo(
    () => products.find((product) => product.id === editProductId) ?? null,
    [editProductId, products],
  )

  useEffect(() => {
    let isActive = true

    fetch("/api/admin/operations/products/drafts", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load finished product drafts.")
        }

        return response.json() as Promise<{ drafts?: FinishedProductDraft[] }>
      })
      .then((data) => {
        if (isActive) {
          setDrafts(Array.isArray(data.drafts) ? data.drafts : [])
        }
      })
      .catch(() => {
        if (isActive) {
          setDraftMessage("Drafts could not be loaded from your account.")
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  const activeDraft = useMemo(
    () => drafts.find((draft) => draft.id === activeDraftId) ?? null,
    [activeDraftId, drafts],
  )

  const filteredProducts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()

    if (!query) {
      return products
    }

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.sku,
        product.category,
        product.warehouseName,
        product.materialSummary,
        ...product.recipeDetails.map((material) => `${material.itemName} ${material.sku}`),
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [deferredSearch, products])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pagedProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE)
  const draftSelectedIds = activeDraft?.materials.map((material) => material.id) ?? []
  const draftQuantities = Object.fromEntries(
    activeDraft?.materials.map((material) => [material.id, material.quantityDisplay]) ?? [],
  )
  const draftNotes = Object.fromEntries(
    activeDraft?.materials.map((material) => [material.id, material.notes]) ?? [],
  )

  function openBlankCreateModal() {
    setActiveDraftId(null)
    setCreateFormVersion((version) => version + 1)
    setShowCreateModal(true)
  }

  function openDraft(draftId: string) {
    setActiveDraftId(draftId)
    setCreateFormVersion((version) => version + 1)
    setShowCreateModal(true)
  }

  async function removeDraft(draftId: string) {
    const previousDrafts = drafts

    setDrafts((current) => current.filter((draft) => draft.id !== draftId))
    if (activeDraftId === draftId) {
      setActiveDraftId(null)
      setCreateFormVersion((version) => version + 1)
    }

    try {
      const response = await fetch(`/api/admin/operations/products/drafts/${draftId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Could not delete draft.")
      }

      setDraftMessage("Draft deleted.")
    } catch {
      setDrafts(previousDrafts)
      setDraftMessage("Draft could not be deleted from your account.")
    }
  }

  function collectDraftFromForm(form: HTMLFormElement): FinishedProductDraft {
    const formData = new FormData(form)
    const materialIds = formData.getAll("materialIds").map(String)
    const now = new Date().toISOString()

    return {
      id: activeDraftId ?? crypto.randomUUID(),
      savedAt: now,
      name: readTextValue(formData, "name"),
      category: readTextValue(formData, "category", categories[0] ?? ""),
      warehouseId: readTextValue(formData, "warehouseId", warehouses[0]?.id ?? ""),
      price: readTextValue(formData, "price"),
      imageUrl: readTextValue(formData, "imageUrl"),
      description: readTextValue(formData, "description"),
      openingQty: readTextValue(formData, "openingQty", "0"),
      reorderThreshold: readTextValue(formData, "reorderThreshold", "10"),
      widthCm: readTextValue(formData, "widthCm", "0"),
      depthCm: readTextValue(formData, "depthCm", "0"),
      heightCm: readTextValue(formData, "heightCm", "0"),
      weightKg: readTextValue(formData, "weightKg", "0"),
      unitOfMeasure: readTextValue(formData, "unitOfMeasure", "pcs"),
      badge: readTextValue(formData, "badge"),
      isPublished: formData.get("isPublished") === "on",
      materials: materialIds.map((id) => ({
        id,
        quantityDisplay: readTextValue(formData, `quantityDisplay:${id}`),
        notes: readTextValue(formData, `notes:${id}`),
      })),
    }
  }

  async function saveCreateDraft() {
    const form = createFormRef.current

    if (!form) {
      return
    }

    const nextDraft = collectDraftFromForm(form)

    // Close immediately to feel fast
    setShowCreateModal(false)

    // Optimistically show draft
    setDrafts((current) => {
      const withoutCurrent = current.filter((draft) => draft.id !== nextDraft.id)
      return [nextDraft, ...withoutCurrent].slice(0, 8)
    })
    setActiveDraftId(nextDraft.id)
    setDraftMessage("Saving draft...")

    try {
      const response = await fetch("/api/admin/operations/products/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ draft: nextDraft }),
      })

      if (!response.ok) {
        throw new Error("Could not save draft.")
      }

      const data = (await response.json()) as { draft?: FinishedProductDraft }
      const savedDraft = data.draft ?? nextDraft

      setDrafts((current) => {
        const withoutCurrent = current.filter((draft) => draft.id !== nextDraft.id && draft.id !== savedDraft.id)
        return [savedDraft, ...withoutCurrent].slice(0, 8)
      })
      setActiveDraftId(savedDraft.id)
      setDraftMessage("Created new draft.")
    } catch {
      setDraftMessage("Draft could not be saved to your account.")
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[#f1f5f9] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-[28px] font-bold tracking-tight text-[#0f172a]">
              {isArchivedView ? "Archived Products" : "Product List"}
            </h2>
            <p className="text-[14px] text-[#64748b]">
              {isArchivedView
                ? "View products that have been archived and hidden from your active catalog."
                : "Manage your list of products and publish them to your storefront."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center lg:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search products, SKU, categories..."
                className="w-full rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] py-3 pl-11 pr-4 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
              />
            </div>
            {!isArchivedView && (
              <button
                onClick={openBlankCreateModal}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-[#0f172a] px-6 py-3.5 text-[14px] font-semibold text-white transition-all hover:bg-[#1e293b] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0f172a]/50 focus:ring-offset-2 active:scale-95 shrink-0"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Product
              </button>
            )}
          </div>
        </div>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-[#cbd5e1] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f1f5f9] text-[#94a3b8]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="mt-4 text-[16px] font-semibold text-[#0f172a]">
            {isArchivedView ? "No archived products found" : "No products found"}
          </h3>
          <p className="mt-2 text-[14px] text-[#64748b]">
            {isArchivedView
              ? "There are no archived products matching your search criteria."
              : "Try adjusting your search criteria or add a new product."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {pagedProducts.map((product) => {
            return (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white shadow-sm transition-all hover:border-[#cbd5e1] hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden bg-[#f1f5f9] shrink-0 border-b border-[#f1f5f9]">
                  <img
                    src={product.imageUrl || `https://placehold.co/400x300/f5f0e8/2d2d2d?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md ${
                        product.state === "ARCHIVED"
                          ? "bg-[#b91c1c]/90 text-white"
                          : product.isPublished
                          ? "bg-white/90 text-[#16a34a]"
                          : "bg-[#0f172a]/80 text-white"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${product.isPublished && product.state !== "ARCHIVED" ? "bg-[#16a34a]" : "bg-white"}`}></span>
                      {product.state === "ARCHIVED" ? "Archived" : product.isPublished ? "Published" : "Hidden"}
                    </span>
                  </div>
                  {product.badge && (
                    <div className="absolute right-4 top-4">
                      <span className="inline-flex items-center rounded-lg bg-rose-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[16px] font-bold text-[#0f172a] line-clamp-1" title={product.name}>
                        {product.name}
                      </h4>
                      <span className="shrink-0 text-[15px] font-black text-[#0f172a]">
                        {formatPeso(product.price)}
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-[#64748b]">
                      SKU: <span className="font-mono text-[#0f172a]">{product.sku}</span>
                    </p>
                    {product.productCode && (
                      <p className="text-[12px] font-medium text-[#64748b]">
                        Code: <span className="font-mono font-bold text-[#0f172a]">{product.productCode}</span>
                      </p>
                    )}
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold text-[#475569]">
                      {product.category}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold text-[#475569]">
                      {product.warehouseName}
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 rounded-2xl bg-[#f8fafc] p-3 text-center border border-[#f1f5f9]">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Stock</span>
                      <span className={`mt-0.5 text-[14px] font-bold ${product.availableQty <= product.reorderThreshold ? 'text-amber-600' : 'text-[#0f172a]'}`}>
                        {product.availableQty}
                      </span>
                    </div>
                    <div className="flex flex-col border-l border-[#e2e8f0]">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Recipe</span>
                      <span className="mt-0.5 text-[14px] font-bold text-[#0f172a]">
                        {product.recipeCount} items
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#f1f5f9]">
                    <button
                      type="button"
                      onClick={() => setOpenProductId(product.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-[#cbd5e1] px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] transition-all hover:bg-[#f8fafc] hover:border-[#94a3b8] active:scale-95"
                    >
                      <svg className="h-4 w-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Product Info
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="mt-8 flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow-sm border border-[#e2e8f0]">
          <div className="text-[14px] text-[#64748b] hidden sm:block">
            Showing <span className="font-semibold text-[#0f172a]">{pageStart + 1}</span> to <span className="font-semibold text-[#0f172a]">{Math.min(pageStart + PAGE_SIZE, filteredProducts.length)}</span> of <span className="font-semibold text-[#0f172a]">{filteredProducts.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={currentPage <= 1}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition-all hover:bg-[#f8fafc] hover:text-[#0f172a] disabled:pointer-events-none disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage <= 1}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition-all hover:bg-[#f8fafc] hover:text-[#0f172a] disabled:pointer-events-none disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex h-10 min-w-[100px] items-center justify-center rounded-xl bg-[#f8fafc] px-4 text-[13px] font-semibold text-[#64748b]">
              <span className="text-[#0f172a]">{currentPage}</span> <span className="mx-1">/</span> {totalPages}
            </div>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage >= totalPages}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition-all hover:bg-[#f8fafc] hover:text-[#0f172a] disabled:pointer-events-none disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition-all hover:bg-[#f8fafc] hover:text-[#0f172a] disabled:pointer-events-none disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      {drafts.length > 0 ? (
        <section className="mt-8 rounded-[32px] border border-[#cbd5e1] bg-[#f8fafc] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm text-[#0f172a]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-[20px] font-bold text-[#0f172a]">Saved Drafts</h3>
              </div>
              <p className="text-[14px] text-[#64748b] leading-relaxed">
                Resume working on products you haven't finished yet. Drafts are safely stored on your account.
              </p>
              {draftMessage ? <p className="inline-flex items-center gap-2 rounded-lg bg-[#fef2f2] px-3 py-2 text-[13px] font-medium text-[#b91c1c]">{draftMessage}</p> : null}
            </div>
            
            <div className="flex-1 w-full overflow-x-auto pb-4 -mb-4 snap-x">
              <div className="flex gap-4 min-w-max">
                {drafts.map((draft) => (
                  <article
                    key={draft.id}
                    className="group relative flex w-[320px] snap-center flex-col justify-between overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white p-6 shadow-sm transition-all hover:border-[#cbd5e1] hover:shadow-md"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-lg bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                          {draft.category || "Uncategorized"}
                        </span>
                        <span className="text-[12px] font-medium text-[#94a3b8]">
                          {formatDraftTime(draft.savedAt)}
                        </span>
                      </div>
                      <h4 className="text-[16px] font-bold text-[#0f172a] line-clamp-1 mb-1">
                        {draft.name || "Untitled Product"}
                      </h4>
                      <div className="text-[13px] text-[#64748b] flex items-center gap-2">
                         <span>{draft.openingQty || 0} initial stock</span>
                         <span className="h-1 w-1 bg-[#cbd5e1] rounded-full"></span>
                         <span>{draft.price ? formatPeso(Number(draft.price)) : "₱0.00"}</span>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        {draft.imageUrl ? (
                          <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#f1f5f9]">
                            <img src={draft.imageUrl} className="h-full w-full object-cover opacity-80" alt="Draft preview" />
                          </div>
                        ) : null}
                        <div className="flex-1 rounded-xl bg-[#f8fafc] p-3 border border-[#f1f5f9]">
                          <p className="text-[12px] font-semibold text-[#475569]">{draft.materials.length} Materials attached</p>
                          <p className="text-[11px] text-[#94a3b8] line-clamp-1 mt-0.5">
                            {draft.materials.length > 0 ? "Includes recipe items" : "No recipe added yet"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openDraft(draft.id)}
                        className="flex-1 rounded-xl bg-[#0f172a] px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#1e293b] hover:shadow-md active:scale-95"
                      >
                        Continue Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDraft(draft.id)}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-[#e2e8f0] text-[#64748b] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                        title="Delete draft"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-4 backdrop-blur-md sm:p-6 lg:p-8">
          <div className="flex max-h-full w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-[#e5e7eb] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] bg-[#f8fafc] px-8 py-6">
              <div>
                <h2 className="text-[24px] font-bold text-[#0f172a]">Create new product</h2>
                {activeDraft ? (
                  <p className="mt-1.5 flex items-center gap-2 text-[13px] font-medium text-[#64748b]">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    </span>
                    Restored draft saved {formatDraftTime(activeDraft.savedAt)}
                  </p>
                ) : (
                  <p className="mt-1 text-[13px] text-[#64748b]">
                    Add a new product to your catalog and configure its stock settings.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white border border-[#e2e8f0] text-[#64748b] transition-all hover:bg-[#f1f5f9] hover:text-[#0f172a] hover:shadow-sm"
              >
                ✕
              </button>
            </div>
            
            <form
              key={`${activeDraftId ?? "new"}-${createFormVersion}`}
              ref={createFormRef}
              method="post"
              action="/api/admin/operations/products/create"
              className="flex min-h-0 flex-1 flex-col bg-[#fbfdff]"
            >
              <div className="flex-1 overflow-y-auto p-8">
                {rawMaterials.length === 0 ? (
                  <div className="mb-6 rounded-2xl border border-dashed border-[#fca5a5] bg-[#fff7f7] p-6 text-[14px] text-[#b91c1c]">
                    No raw materials exist in inventory yet, so finished products cannot be created. Add the needed
                    materials in Inventory first.
                  </div>
                ) : null}

                <div className="mx-auto max-w-6xl space-y-8">
                {activeDraft ? <input type="hidden" name="draftId" value={activeDraft.id} /> : null}
                <div className="grid gap-8 xl:grid-cols-2">
                  <div className="flex flex-col gap-6 rounded-[24px] border border-[#e2e8f0] bg-white p-7 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-5">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0fdf4] text-[#16a34a]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
                      <h3 className="text-[16px] font-bold text-[#0f172a]">
                        Catalog details
                      </h3>
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
                        <ImageDropField name="imageUrl" defaultValue={activeDraft?.imageUrl ?? ""} />
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

                  <div className="flex flex-col gap-6 rounded-[24px] border border-[#e2e8f0] bg-white p-7 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-5">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff6ff] text-[#0ea5e9]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-[16px] font-bold text-[#0f172a]">
                        Inventory & Stock settings
                      </h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="grid gap-2 outline-none">
                        <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                          Opening stock
                          <div className="group relative flex items-center justify-center">
                            <svg className="h-4 w-4 text-[#94a3b8] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="absolute bottom-full left-1/2 mb-2 hidden w-48 -translate-x-1/2 rounded bg-[#0f172a] px-3 py-2 text-center text-[12px] text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-10">
                              Initial amount of stock currently available in warehouse
                            </div>
                          </div>
                        </span>
                        <input
                          name="openingQty"
                          type="number"
                          min="0"
                          defaultValue={activeDraft?.openingQty ?? 0}
                          className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                        />
                      </label>
                      <label className="grid gap-2 outline-none">
                        <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                          Reorder threshold
                          <div className="group relative flex items-center justify-center">
                            <svg className="h-4 w-4 text-[#94a3b8] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="absolute bottom-full left-1/2 mb-2 hidden w-56 -translate-x-1/2 rounded bg-[#0f172a] px-3 py-2 text-center text-[12px] text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-10">
                              Triggers an alert when stock drops below this value
                            </div>
                          </div>
                        </span>
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
                </div>

                <div className="rounded-[24px] border border-[#e2e8f0] bg-white p-7 shadow-sm">
                  <MaterialSelector
                    materials={rawMaterials}
                    defaultSelectedIds={draftSelectedIds}
                    defaultQuantities={draftQuantities}
                    defaultNotes={draftNotes}
                  />
                </div>
              </div>
              </div>

              <div className="flex-shrink-0 border-t border-[#e2e8f0] bg-white px-8 py-5">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={rawMaterials.length === 0}
                      className="inline-flex cursor-pointer appearance-none items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#1e293b] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0f172a]/50 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:bg-[#94a3b8]"
                    >
                      Create Product
                    </button>
                    <button
                      type="button"
                      onClick={saveCreateDraft}
                      className="inline-flex cursor-pointer appearance-none items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-6 py-3 text-[14px] font-semibold text-[#0f172a] transition-all hover:bg-[#f8fafc] hover:border-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 focus:ring-offset-2 active:scale-95"
                    >
                      Save as Draft
                    </button>
                  </div>
                  {activeDraft ? (
                    <button
                      type="button"
                      onClick={() => removeDraft(activeDraft.id)}
                      className="inline-flex cursor-pointer appearance-none items-center justify-center gap-2 rounded-xl border border-transparent px-5 py-3 text-[14px] font-semibold text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95"
                    >
                      Delete Draft
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-4 backdrop-blur-md sm:p-6 lg:p-8">
          <div className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-[#e5e7eb] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] bg-[#f8fafc] px-8 py-6">
              <div>
                <h2 className="text-[24px] font-bold text-[#0f172a]">{selectedProduct.name}</h2>
                <p className="mt-1 text-[13px] text-[#64748b]">Product information and material recipe.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenProductId(null)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white border border-[#e2e8f0] text-[#64748b] transition-all hover:bg-[#f1f5f9] hover:text-[#0f172a] hover:shadow-sm"
              >
                X
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#fbfdff] p-8">
              <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
                <section className="self-start overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white shadow-sm">
                  <div className="aspect-[4/3] bg-[#f1f5f9]">
                    {selectedProduct.imageUrl ? (
                      <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-[13px] font-semibold text-[#94a3b8]">No product image</div>
                    )}
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">SKU</p>
                      <p className="mt-1 font-mono text-[15px] font-semibold text-[#0f172a]">{selectedProduct.sku}</p>
                    </div>
                    {selectedProduct.productCode && (
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Product Code</p>
                        <p className="mt-1 font-mono text-[15px] font-bold text-[#1d4ed8]">{selectedProduct.productCode}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#f8fafc] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Stock</p>
                        <p className="mt-1 text-[20px] font-bold text-[#0f172a]">{selectedProduct.availableQty}</p>
                      </div>
                      <div className="rounded-2xl bg-[#f8fafc] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Min</p>
                        <p className="mt-1 text-[20px] font-bold text-[#0f172a]">{selectedProduct.reorderThreshold}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${
                        selectedProduct.state === "ARCHIVED"
                          ? "bg-[#fee2e2] text-[#991b1b]"
                          : selectedProduct.isPublished
                          ? "bg-[#dcfce7] text-[#166534]"
                          : "bg-[#f1f5f9] text-[#475569]"
                      }`}
                    >
                      {selectedProduct.state === "ARCHIVED"
                        ? "Archived and hidden from storefront"
                        : selectedProduct.isPublished
                        ? "Published on storefront"
                        : "Hidden from storefront"}
                    </span>
                  </div>
                </section>

                <div className="space-y-8">
                  <section className="rounded-[24px] border border-[#e2e8f0] bg-white p-7 shadow-sm">
                    <div className="mb-6 border-b border-[#f1f5f9] pb-5">
                      <h3 className="text-[16px] font-bold text-[#0f172a]">Catalog details</h3>
                    </div>
                    <dl className="grid gap-5 md:grid-cols-2">
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Product name</dt>
                        <dd className="mt-1 text-[15px] font-semibold text-[#0f172a]">{selectedProduct.name}</dd>
                      </div>
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Category</dt>
                        <dd className="mt-1 text-[15px] font-semibold text-[#0f172a]">{selectedProduct.category}</dd>
                      </div>
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Selling price</dt>
                        <dd className="mt-1 text-[15px] font-semibold text-[#0f172a]">{formatPeso(selectedProduct.price)}</dd>
                      </div>
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Warehouse</dt>
                        <dd className="mt-1 text-[15px] font-semibold text-[#0f172a]">{selectedProduct.warehouseName}</dd>
                      </div>
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Badge</dt>
                        <dd className="mt-1 text-[15px] font-semibold text-[#0f172a]">{selectedProduct.badge ?? "-"}</dd>
                      </div>
                      <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Recipe</dt>
                        <dd className="mt-1 text-[15px] font-semibold text-[#0f172a]">{selectedProduct.recipeCount} materials</dd>
                      </div>
                      {/* Description — collapsible to keep catalog fields compact */}
                      {selectedProduct.description && (
                        <div className="md:col-span-2">
                          <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#94a3b8]">Description</dt>
                          <DescriptionBlock text={selectedProduct.description} />
                        </div>
                      )}
                    </dl>
                  </section>

                  <section className="rounded-[24px] border border-[#e2e8f0] bg-white p-7 shadow-sm">
                    <div className="mb-6 border-b border-[#f1f5f9] pb-5">
                      <h3 className="text-[16px] font-bold text-[#0f172a]">Material recipe</h3>
                    </div>
                    {selectedProduct.recipeDetails.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-[#cbd5e1] p-6 text-center text-[13px] text-[#64748b]">
                        No materials are assigned to this finished product.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-[13px]">
                          <thead>
                            <tr className="border-b border-[#e2e8f0] text-[#64748b]">
                              <th className="py-3 pr-4 font-semibold">SKU</th>
                              <th className="py-3 pr-4 font-semibold">Material</th>
                              <th className="py-3 pr-4 font-semibold">Qty</th>
                              <th className="py-3 font-semibold">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProduct.recipeDetails.map((material) => (
                              <tr key={material.id} className="border-b border-[#f1f5f9] last:border-b-0">
                                <td className="py-3 pr-4 font-mono text-[#0f172a]">{material.sku}</td>
                                <td className="py-3 pr-4 font-semibold text-[#0f172a]">{material.itemName}</td>
                                <td className="py-3 pr-4 text-[#334155]">{material.quantityDisplay || "-"}</td>
                                <td className="py-3 text-[#64748b]">{material.notes || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>

                  <section className="rounded-[24px] border border-[#e2e8f0] bg-white p-7 shadow-sm">
                    <div className="mb-6 border-b border-[#f1f5f9] pb-5">
                      <h3 className="text-[16px] font-bold text-[#0f172a]">Color variants</h3>
                    </div>
                    {selectedProduct.colorVariants.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-[#cbd5e1] p-6 text-center text-[13px] text-[#64748b]">
                        No color variants defined for this product.
                      </p>
                    ) : (
                      <ul className="flex flex-wrap gap-2">
                        {selectedProduct.colorVariants.map((v, i) => (
                          <li
                            key={i}
                            className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5 text-[12px]"
                          >
                            <span
                              className="inline-block h-4 w-4 rounded-full border border-[#e2e8f0]"
                              style={{ backgroundColor: v.hex }}
                              aria-hidden
                            />
                            <span className="font-semibold text-[#0f172a]">{v.name}</span>
                            <span className="font-mono text-[10px] text-[#64748b]">{v.sku}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-[#e2e8f0] bg-white px-8 py-5">
              <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {selectedProduct.state === "ARCHIVED" ? (
                  <span className="rounded-xl bg-[#f8fafc] px-4 py-3 text-[14px] font-medium text-[#64748b]">
                    Archived product
                  </span>
                ) : (
                  <form
                    method="post"
                    action="/api/admin/operations/products/delete"
                    onSubmit={(event) => {
                      const confirmed = confirm(`Archive ${selectedProduct.name} and hide it from the storefront? This cannot be undone.`)
                      if (!confirmed) {
                        event.preventDefault()
                      }
                    }}
                  >
                    <input type="hidden" name="productId" value={selectedProduct.id} />
                    <input type="hidden" name="productStockId" value={selectedProduct.productStockId} />
                    <button
                      type="submit"
                      className="rounded-xl px-4 py-3 text-[14px] font-medium text-[#b91c1c] transition-colors hover:bg-[#fef2f2]"
                    >
                      Archive product
                    </button>
                  </form>
                )}
                <div className="flex items-center gap-3">
                  {!isArchivedView && selectedProduct.state !== "ARCHIVED" && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenProductId(null)
                        setEditProductId(selectedProduct.id)
                      }}
                      className="flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-[14px] font-semibold text-[#0f172a] transition-all hover:bg-[#f8fafc] hover:border-[#94a3b8] active:scale-95"
                    >
                      <svg className="h-4 w-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit product
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenProductId(null)}
                    className="rounded-xl bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#1e293b] hover:shadow-md active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit product modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-4 backdrop-blur-md sm:p-6 lg:p-8">
          <div className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-[#e5e7eb] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] bg-[#f8fafc] px-8 py-6">
              <div>
                <h2 className="text-[24px] font-bold text-[#0f172a]">Edit: {editProduct.name}</h2>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  {isExecutiveAdmin
                    ? "As executive admin, your changes will be applied immediately."
                    : "Your edits will be sent to executive admin for approval before going live."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditProductId(null)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white border border-[#e2e8f0] text-[#64748b] transition-all hover:bg-[#f1f5f9] hover:text-[#0f172a] hover:shadow-sm"
              >
                ✕
              </button>
            </div>

            <form
              method="post"
              action={isExecutiveAdmin ? "/api/admin/operations/products/update" : "/api/admin/operations/products/request-edit"}
              onSubmit={() => {
                if (!isExecutiveAdmin) {
                  // Show confirmation popup after submit
                  setTimeout(() => setShowEditConfirm(true), 100)
                }
              }}
              className="flex min-h-0 flex-1 flex-col bg-[#fbfdff]"
            >
              <input type="hidden" name="productId" value={editProduct.id} />
              <input type="hidden" name="productStockId" value={editProduct.productStockId} />

              <div className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-3xl space-y-6">
                  {!isExecutiveAdmin && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800">
                      <span className="font-semibold">Note:</span> Recipe changes are not allowed through this form. Only product info (name, price, image, description, warehouse, visibility) can be edited. The executive admin must approve before changes go live.
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-[13px] font-semibold text-[#475569]">Product name <span className="text-red-500">*</span></span>
                      <input
                        name="name"
                        required
                        defaultValue={editProduct.name}
                        className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-[13px] font-semibold text-[#475569]">Category <span className="text-red-500">*</span></span>
                      <select
                        name="category"
                        defaultValue={editProduct.category}
                        className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-[13px] font-semibold text-[#475569]">Selling price (₱) <span className="text-red-500">*</span></span>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        defaultValue={editProduct.price}
                        className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-[13px] font-semibold text-[#475569]">Warehouse</span>
                      <select
                        name="warehouseId"
                        defaultValue={warehouses[0]?.id ?? ""}
                        className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                      >
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-[13px] font-semibold text-[#475569]">Badge (optional)</span>
                      <input
                        name="badge"
                        defaultValue={editProduct.badge ?? ""}
                        placeholder="e.g. SALE, HOT"
                        className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                      />
                    </label>

                    <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-4 transition-colors hover:border-[#0f172a] hover:bg-white self-end">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          name="isPublished"
                          defaultChecked={editProduct.isPublished}
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#0f172a] focus:ring-[#0f172a]"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#0f172a]">Published on storefront</span>
                        <span className="text-[12px] text-[#64748b]">Visible to customers</span>
                      </div>
                    </label>

                    <label className="sm:col-span-2 grid gap-2">
                      <span className="text-[13px] font-semibold text-[#475569]">Description <span className="text-red-500">*</span></span>
                      <textarea
                        name="description"
                        rows={5}
                        required
                        defaultValue={editProduct.description}
                        className="w-full resize-none rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition-colors focus:border-[#0f172a] focus:bg-white focus:ring-1 focus:ring-[#0f172a]"
                      />
                    </label>

                    <label className="sm:col-span-2 grid gap-2">
                      <span className="text-[13px] font-semibold text-[#475569]">Product image</span>
                      <ImageDropField
                        name="imageUrl"
                        defaultValue={editProduct.imageUrl}
                        altPreview={editProduct.name}
                      />
                    </label>

                    <div className="sm:col-span-2 rounded-2xl border border-[#e2e8f0] bg-white p-5">
                      <ColorVariantsEditor
                        defaultValue={editProduct.colorVariants}
                        productMainSku={editProduct.sku}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 border-t border-[#e2e8f0] bg-white px-8 py-5">
                <div className="mx-auto flex max-w-3xl items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEditProductId(null)}
                    className="rounded-xl border border-[#e2e8f0] px-5 py-3 text-[14px] font-semibold text-[#475569] transition-all hover:bg-[#f8fafc]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#1e293b] hover:shadow-md active:scale-95"
                  >
                    {isExecutiveAdmin ? (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Save changes
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        Submit for approval
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit submitted confirmation popup */}
      {showEditConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-2xl text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-600">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[20px] font-bold text-[#0f172a]">Edit submitted</h3>
            <p className="mt-2 text-[14px] leading-[22px] text-[#64748b]">
              Your product edit has been submitted and is waiting for executive admin confirmation before it goes live.
            </p>
            <button
              type="button"
              onClick={() => setShowEditConfirm(false)}
              className="mt-6 w-full rounded-xl bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#1e293b] active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
