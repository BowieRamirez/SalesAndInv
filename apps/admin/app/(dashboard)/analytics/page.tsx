import { ExecutiveReportsClient } from "@/components/dashboard/ExecutiveReportsClient"
import { requireAuthenticatedAppUser } from "@/lib/auth/session"
import { getExecutiveReportsData } from "@/lib/dashboard/executive"

export const dynamic = "force-dynamic"

export default async function AnalyticsDashboardPage() {
  const [currentUser, data] = await Promise.all([requireAuthenticatedAppUser(), getExecutiveReportsData()])

  return <ExecutiveReportsClient userName={currentUser.name} data={data} />
}
