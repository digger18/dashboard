import DashboardNav from "./dashboard-nav";
import TeamSelector from "./team-selector";
import LogoWithoutText from "../globals/logo-without-text";
import { Suspense } from "react";
import DashboardSearch from "./dashboard-search";

export default function Sidebar() {
  return (
    <aside className="relative flex h-svh w-64 min-w-64 flex-col border-r">
      <header className="flex h-[var(--protected-nav-height)] w-full items-center justify-between border-b pr-2">
        <span className="inline-flex items-center">
          <LogoWithoutText className="size-12" />
          <span className="font-mono text-xs text-fg-300">E2B</span>
        </span>
      </header>

      <div className="p-3">
        <Suspense fallback={<></>}>
          <DashboardSearch />
        </Suspense>
      </div>

      <Suspense fallback={<></>}>
        <DashboardNav className="flex-1 p-2 pt-0" />
      </Suspense>

      <footer className="flex flex-col gap-2 p-3">
        <Suspense fallback={<></>}>
          <TeamSelector />
        </Suspense>
      </footer>
    </aside>
  );
}
