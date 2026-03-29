import { ExecutiveOverviewClient } from "@/components/dashboard/ExecutiveOverviewClient"
import { getExecutiveOverviewData } from "@/lib/dashboard/executive"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

export default async function ExecutiveDashboardPage() {
  const [currentUser, data] = await Promise.all([requireAuthenticatedAppUser(), getExecutiveOverviewData()])

  return <ExecutiveOverviewClient userName={currentUser.name} data={data} />
}
