import { Box } from "lucide-react"
import { RevealImageList } from "@/components/ui/reveal-images"

type AuthMarketingPanelProps = {
  eyebrow: string
}

export function AuthMarketingPanel({ eyebrow }: AuthMarketingPanelProps) {
  return (
    <div className="bg-navy relative flex min-h-[560px] flex-col justify-between overflow-hidden p-8 text-white lg:min-h-screen lg:w-[45%] xl:p-14">
      <div className="pointer-events-none absolute top-[-10%] left-[-15%] h-[45rem] w-[45rem] rounded-full border-[60px] border-white/[0.03]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[30rem] w-[30rem] rounded-full border-[40px] border-white/[0.03]" />
      <div className="pointer-events-none absolute top-[30%] right-[-15%] h-[50rem] w-[50rem] rounded-full border-[50px] border-white/[0.03]" />

      <div className="relative z-10 mt-4 flex items-center space-x-3 lg:mt-0">
        <div className="rounded-xl border border-white/5 bg-white/10 p-2.5 shadow-sm">
          <Box className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[17px] leading-tight font-semibold tracking-wide">
            FurniTrack
          </h1>
          <p className="mt-0.5 text-[11px] font-medium tracking-wider text-white/50 uppercase">
            {eyebrow}
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 mb-auto flex w-full max-w-[620px] flex-col items-center text-center">
        <p className="mb-6 max-w-[500px] text-[15px] leading-relaxed text-white/62 xl:text-[16px]">
          FurniTrack offers office tables, mobile pedestals, cabinets, and
          workspace storage built for organized, functional business spaces.
        </p>
        <RevealImageList />
      </div>

      <div className="relative z-10 mb-4 text-[12px] font-medium text-white/40 lg:mb-0 xl:pl-4">
        &copy; 2026 SIMS Co. All rights reserved.
      </div>
    </div>
  )
}
