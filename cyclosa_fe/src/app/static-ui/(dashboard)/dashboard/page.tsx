import { redirect } from "next/navigation";

export default function StaticDashboardRedirectPage() {
  redirect("/dashboard/overview");
}
