"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import BrowserAgentTools from "@/components/BrowserAgentTools";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <BrowserAgentTools />
      {children}
    </TooltipProvider>
  );
}
