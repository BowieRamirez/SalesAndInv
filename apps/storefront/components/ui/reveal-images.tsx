import { cn } from "@/lib/utils"

interface ImageSource {
  src: string
  alt: string
}

interface ShowImageListItemProps {
  text: string
  images: [ImageSource, ImageSource]
}

function RevealImageListItem({ text, images }: ShowImageListItemProps) {
  const container = "absolute right-6 top-4 z-40 h-24 w-20 sm:right-10"
  const effect =
    "relative h-20 w-20 scale-0 overflow-hidden rounded-md opacity-0 shadow-none transition-all delay-100 duration-500 group-hover:h-full group-hover:w-full group-hover:scale-100 group-hover:opacity-100 group-hover:shadow-xl"

  return (
    <div className="group relative h-fit w-full max-w-[620px] overflow-visible py-2 text-center sm:py-3">
      <h3 className="text-center text-[3.1rem] leading-none font-black text-white transition-all duration-500 group-hover:opacity-40 sm:text-[4.9rem] xl:text-[5.6rem]">
        {text}
      </h3>
      <div className={container}>
        <div className={effect}>
          <img
            alt={images[1].alt}
            src={images[1].src}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div
        className={cn(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-all delay-150 duration-500 group-hover:translate-x-6 group-hover:translate-y-6 group-hover:rotate-12"
        )}
      >
        <div className={cn(effect, "duration-200")}>
          <img
            alt={images[0].alt}
            src={images[0].src}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

function RevealImageList() {
  const items: ShowImageListItemProps[] = [
    {
      text: "Office Tables",
      images: [
        {
          src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=240&auto=format&fit=crop&q=70",
          alt: "Office desk in a bright workspace",
        },
        {
          src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=240&auto=format&fit=crop&q=70",
          alt: "Modern office table setup",
        },
      ],
    },
    {
      text: "Pedestals",
      images: [
        {
          src: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=240&auto=format&fit=crop&q=70",
          alt: "Compact office storage near a desk",
        },
        {
          src: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=240&auto=format&fit=crop&q=70",
          alt: "Workspace drawer pedestal and desk",
        },
      ],
    },
    {
      text: "Cabinets",
      images: [
        {
          src: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=240&auto=format&fit=crop&q=70",
          alt: "Wood cabinet storage",
        },
        {
          src: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=240&auto=format&fit=crop&q=70",
          alt: "Office shelving and cabinet display",
        },
      ],
    },
  ]

  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-sm bg-transparent py-4 text-center">
      <p className="text-sm font-black text-white/45 uppercase">
        Office collection
      </p>
      {items.map((item) => (
        <RevealImageListItem
          key={item.text}
          text={item.text}
          images={item.images}
        />
      ))}
    </div>
  )
}

export { RevealImageList }
