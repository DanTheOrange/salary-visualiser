import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "~/components/theme-provider.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </SidebarProvider>
    </ThemeProvider>
    <Analytics />
  </StrictMode>
);
