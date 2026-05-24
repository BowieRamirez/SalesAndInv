"use client"

import { useRef, useState } from "react"

type ImageDropFieldProps = {
  name: string
  defaultValue?: string
  altPreview?: string
  /** Maximum allowed file size in bytes (default 5 MB) */
  maxSizeBytes?: number
  /** Called when the image value changes */
  onChange?: (value: string) => void
}

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024

export function ImageDropField({
  name,
  defaultValue = "",
  altPreview = "Product image preview",
  maxSizeBytes = DEFAULT_MAX_BYTES,
  onChange,
}: ImageDropFieldProps) {
  const [value, setValue] = useState(defaultValue)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | undefined | null) {
    setError(null)

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Only image files are accepted.")
      return
    }

    if (file.size > maxSizeBytes) {
      const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0)
      setError(`Image is too large. Use a file under ${sizeMb} MB.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setValue(result)
      onChange?.(result)
    }
    reader.onerror = () => setError("Could not read that file. Try again.")
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setValue("")
    setError(null)
    onChange?.("")

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={value} />
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.value = ""
            inputRef.current.click()
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            if (inputRef.current) {
              inputRef.current.value = ""
              inputRef.current.click()
            }
          }
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          const file = event.dataTransfer.files?.[0]
          handleFile(file)
        }}
        className={`flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed px-4 py-4 text-center transition-colors ${
          isDragging
            ? "border-[#0f172a] bg-[#eef2ff]"
            : "border-[#cbd5e1] bg-[#f8fafc] hover:border-[#94a3b8] hover:bg-white"
        }`}
      >
        {value ? (
          <img
            src={value}
            alt={altPreview}
            className="h-36 w-full rounded-xl object-cover"
          />
        ) : (
          <>
            <svg
              className="h-8 w-8 text-[#94a3b8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[13px] font-medium text-[#0f172a]">
              {isDragging ? "Drop the image here" : "Drag and drop an image here"}
            </p>
            <p className="text-[12px] text-[#64748b]">or click to browse from your computer</p>
            <p className="text-[11px] text-[#94a3b8]">PNG, JPG, or WEBP up to {(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
      />

      <div className="flex items-center justify-between gap-3">
        {error ? (
          <p className="text-[11px] text-rose-600">{error}</p>
        ) : (
          <p className="text-[11px] text-[#94a3b8]">
            {value ? "Image saved with this product." : "No image selected yet."}
          </p>
        )}

        {value ? (
          <button
            type="button"
            onClick={clearImage}
            className="rounded-lg border border-[#dbe4f0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#475569] transition-colors hover:border-[#94a3b8] hover:text-[#0f172a]"
          >
            Remove image
          </button>
        ) : null}
      </div>
    </div>
  )
}
