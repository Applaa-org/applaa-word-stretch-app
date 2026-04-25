// Pi: Replace this file with your app layout.
// Use Applaa components — import from "@/components/applaa"
// All data/colors come from APP_CONFIG in "@/app-config"
// Your job: pick which components to show and in what order.

import { APP_CONFIG } from "@/app-config";
import {
  AppShell,
  HeroSection,
  StatsRow,
  DataGrid,
} from "@/components/applaa";
import { MadeWithApplaa } from "@/components/made-with-applaa";

export function Index() {
  return (
    <AppShell>
      <HeroSection />

      {APP_CONFIG.features.stats && <StatsRow />}

      <DataGrid />

      <MadeWithApplaa />
    </AppShell>
  );
}
