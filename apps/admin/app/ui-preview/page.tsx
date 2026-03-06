import { Button } from "@furnitrack/ui"
import { Badge } from "@furnitrack/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@furnitrack/ui"
import { Input } from "@furnitrack/ui"

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-beige p-8">
      <h1 className="text-3xl font-bold text-navy mb-2">FurniTrack Admin — Design System</h1>
      <p className="text-muted mb-8">
        Phase 1 smoke test — admin app verifying shared tokens.
      </p>

      {/* Buttons */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="primary">Primary (Gold)</Button>
          <Button variant="secondary">Secondary (Navy)</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Badges</h2>
        <div className="flex gap-3 flex-wrap">
          <Badge variant="BEST_SELLER" />
          <Badge variant="SALE" />
          <Badge variant="HOT" />
          <Badge variant="OUT_OF_STOCK" />
          <Badge variant="LOW_STOCK" />
        </div>
      </section>

      {/* Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Cards</h2>
        <div className="grid grid-cols-1 gap-4 max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-navy">Sample Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-charcoal">Card content with default padding.</p>
              <div className="mt-4">
                <Badge variant="BEST_SELLER" />
                <span className="ml-2 text-coral font-bold">&#8369;4,500</span>
                <span className="ml-2 text-muted line-through text-sm">&#8369;5,200</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Input */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Input</h2>
        <div className="max-w-sm flex flex-col gap-4">
          <Input label="Client Name" placeholder="Enter client name" />
          <Input label="Email" placeholder="email@example.com" type="email" />
          <Input
            label="Budget"
            placeholder="&#8369;0"
            error="Budget must be a positive number"
          />
        </div>
      </section>

      {/* Color Token Reference */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Color Tokens</h2>
        <div className="flex gap-3 flex-wrap">
          {[
            { name: "navy", bg: "bg-navy", text: "text-white" },
            { name: "coral", bg: "bg-coral", text: "text-white" },
            { name: "gold", bg: "bg-gold", text: "text-white" },
            { name: "beige", bg: "bg-beige", text: "text-charcoal" },
            { name: "charcoal", bg: "bg-charcoal", text: "text-white" },
            { name: "muted", bg: "bg-muted", text: "text-white" },
          ].map(({ name, bg, text }) => (
            <div
              key={name}
              className={`${bg} ${text} px-4 py-3 rounded-md text-sm font-medium`}
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      <p className="text-sm text-muted mt-8">
        If all colors above match the brand palette and components render correctly,
        Tailwind v4 + shadcn/ui compatibility is confirmed.
      </p>
    </main>
  )
}
