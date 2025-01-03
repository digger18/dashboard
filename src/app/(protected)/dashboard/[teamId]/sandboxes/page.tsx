"use client";

import SandboxesTable from "@/components/dashboard/sandboxes/sandboxes-table";
import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <DashboardPageLayout
      title="Sandboxes"
      description="View and manage your E2B Sandboxes."
    >
      <SandboxesTable />
    </DashboardPageLayout>
  );
}
