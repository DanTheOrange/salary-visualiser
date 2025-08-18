import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "~/components/ui/sidebar";
import {
  useChartData,
  type PensionContributionType,
  type StudentLoanPlan,
} from "~/hooks/use-chart-data";
import { NumericFormat } from "react-number-format";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Ban, Percent, PoundSterling } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export function AppSidebar() {
  const {
    taxFreeAllowance,
    pensionContribution,
    pensionContributionType,
    proportional,
    studentLoans,
    updateTaxFreeAllowance,
    updatePensionContribution,
    updatePensionContributionType,
    setProportional,
    updateStudentLoans,
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
                <Tooltip>
                  <ToggleGroupItem
                    value="percentage"
                    aria-label="Toggle percentage"
                    asChild
                  >
                    <TooltipTrigger>
                      <Percent className="size-3" />
                    </TooltipTrigger>
                  </ToggleGroupItem>
                  <TooltipContent>Percentage of salary</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <ToggleGroupItem
                    value="defined"
                    aria-label="Toggle defined"
                    asChild
                  >
                    <TooltipTrigger>
                      <PoundSterling className="size-3" />
                    </TooltipTrigger>
                  </ToggleGroupItem>
                  <TooltipContent>Defined amount</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <ToggleGroupItem
                    value="none"
                    aria-label="Toggle none"
                    asChild
                  >
                    <TooltipTrigger>
                      <Ban className="size-3" />
                    </TooltipTrigger>
                  </ToggleGroupItem>
                  <TooltipContent>No contribution</TooltipContent>
                </Tooltip>
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
            <label htmlFor="student-loans" className="text-sm font-medium">
              Student Loans
            </label>
            <div className="flex flex-col gap-2">
              <ToggleGroup
                type="multiple"
                variant="outline"
                value={Object.entries(studentLoans)
                  .filter(([, isActive]) => isActive)
                  .map(([plan]) => plan)}
                onValueChange={(plans: StudentLoanPlan[]) =>
                  updateStudentLoans({
                    plan1: plans.includes("plan1") ? true : false,
                    plan2: plans.includes("plan2") ? true : false,
                    plan5: plans.includes("plan5") ? true : false,
                    postgrad: plans.includes("postgrad") ? true : false,
                  })
                }
                size="xs"
              >
                <ToggleGroupItem
                  value="plan1"
                  aria-label="Toggle plan1"
                  className="flex-none"
                >
                  Plan 1
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="plan2"
                  aria-label="Toggle plan2"
                  className="flex-none"
                >
                  Plan 2
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="plan5"
                  aria-label="Toggle plan5"
                  className="flex-none"
                >
                  Plan 5
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="postgrad"
                  aria-label="Toggle postgrad"
                  className="flex-none"
                >
                  Postgraduate
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
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
            <p className="text-xs text-muted-foreground">
              * If proportional is enabled, the chart will show the
              contributions as a percentage of the total salary, rather than the
              actual amounts. This is useful for comparing contributions across
              different salary levels.
            </p>
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
