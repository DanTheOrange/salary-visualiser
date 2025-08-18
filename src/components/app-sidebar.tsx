import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "~/components/ui/sidebar";
import {
  useChartData,
  type PensionContributionType,
} from "~/hooks/use-chart-data";
import { NumericFormat } from "react-number-format";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Ban, Percent, PoundSterling } from "lucide-react";
import { useTheme } from "./theme-provider";

export function AppSidebar() {
  const {
    taxFreeAllowance,
    pensionContribution,
    pensionContributionType,
    proportional,
    updateTaxFreeAllowance,
    updatePensionContribution,
    updatePensionContributionType,
    setProportional,
  } = useChartData();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* tax free amount */}
          <div className="flex flex-col gap-1">
            <label htmlFor="tax-free-allowance" className="text-sm font-medium">
              Tax Free Allowance
            </label>
            <NumericFormat
              id="tax-free-allowance"
              customInput={Input}
              prefix="£"
              placeholder="£12,570"
              thousandSeparator
              value={taxFreeAllowance}
              onValueChange={({ floatValue }) => {
                if (floatValue !== undefined) {
                  updateTaxFreeAllowance(floatValue);
                }
              }}
            />
          </div>
        </SidebarGroup>
        <SidebarGroup>
          {/* pension contribution */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pension-contribution"
              className="flex flex-row justify-between"
            >
              <span className="text-sm font-medium">Pension Contribution</span>

              <ToggleGroup
                variant="outline"
                type="single"
                value={pensionContributionType}
                onValueChange={(value: PensionContributionType) => {
                  if (!value) return;
                  updatePensionContributionType(value);
                }}
                size="xxs"
              >
                <ToggleGroupItem
                  value="percentage"
                  aria-label="Toggle percentage"
                >
                  <Percent className="size-3" />
                </ToggleGroupItem>
                <ToggleGroupItem value="defined" aria-label="Toggle defined">
                  <PoundSterling className="size-3" />
                </ToggleGroupItem>
                <ToggleGroupItem value="none" aria-label="Toggle none">
                  <Ban className="size-3" />
                </ToggleGroupItem>
              </ToggleGroup>
            </label>
            <NumericFormat
              id="pension-contribution"
              customInput={Input}
              prefix={pensionContributionType === "defined" ? "£" : undefined}
              suffix={
                pensionContributionType === "percentage" ? "%" : undefined
              }
              placeholder={pensionContributionType === "defined" ? "£0" : "0%"}
              thousandSeparator={
                pensionContributionType === "defined" ? true : false
              }
              max={pensionContributionType === "percentage" ? 100 : undefined}
              min={0}
              value={
                pensionContributionType === "none" ? 0 : pensionContribution
              }
              disabled={pensionContributionType === "none"}
              onValueChange={({ floatValue }) => {
                if (
                  floatValue !== undefined &&
                  pensionContributionType !== "none"
                ) {
                  updatePensionContribution(floatValue);
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              * Pension is assumed to be salary sacrifice for ease of
              calculation. If you are a higher rate tax payer, you will need to
              take extra steps to claim back tax.
            </p>
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="proportional"
              className="text-sm font-medium flex flex-row justify-between"
            >
              Proportional
            </label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={proportional ? "true" : "false"}
              onValueChange={(value) => {
                if (!value) return;
                setProportional(value === "true");
              }}
              size="xs"
            >
              <ToggleGroupItem
                value="true"
                aria-label="Toggle proportional"
                className="flex-none"
              >
                Yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="false"
                aria-label="Toggle not proportional"
                className="flex-none"
              >
                No
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="theme"
              className="text-sm font-medium flex flex-row justify-between"
            >
              Theme
            </label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={theme}
              onValueChange={(value: "dark" | "light" | "system") => {
                if (!value) return;
                setTheme(value);
              }}
              size="xs"
            >
              <ToggleGroupItem
                value="dark"
                aria-label="Toggle dark theme"
                className="flex-none"
              >
                Dark
              </ToggleGroupItem>
              <ToggleGroupItem
                value="light"
                aria-label="Toggle light theme"
                className="flex-none"
              >
                Light
              </ToggleGroupItem>
              <ToggleGroupItem
                value="system"
                aria-label="Toggle system theme"
                className="flex-none"
              >
                System
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground">
          * This is not likely to be completely accurate, or regularly updated.
        </p>
        <p className="text-xs text-muted-foreground">
          Numbers are rounded, some simplifications might have been made and a
          lot of variables aren't considered.
        </p>
        <p className="text-xs text-muted-foreground">
          Maybe, use another more accurate and up to date tool like:{" "}
          <a
            className="text-primary hover:underline"
            target="_blank"
            href="https://www.thesalarycalculator.co.uk/"
          >
            https://www.thesalarycalculator.co.uk/
          </a>
        </p>
        <p className="text-xs text-muted-foreground">
          Better still, talk to a financial professional.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
