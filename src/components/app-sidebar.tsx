import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "~/components/ui/sidebar";
import {
  useChartData,
  type PensionContributionType,
  type StudentLoanPlan,
} from "~/hooks/use-chart-data";
import { NumericFormat } from "react-number-format";
import { Input } from "./ui/input";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Ban, Percent, Plus, PoundSterling, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function AppSidebar() {
  const {
    chartPoints,
    taxFreeAllowance,
    pensionContribution,
    pensionContributionType,
    proportional,
    studentLoans,
    periodicity,
    resetChartPointsToDefault,
    addChartPoint,
    removeChartPoint,
    updateTaxFreeAllowance,
    updatePensionContribution,
    updatePensionContributionType,
    setProportional,
    updateStudentLoans,
    setPeriodicity,
  } = useChartData();
  const [salary, setSalary] = useState<string | undefined>(undefined);
  const { theme, setTheme } = useTheme();

  const usefulSalaries = [12570, 34000, 50700, 100000, 125140].filter(
    (point) => !chartPoints.includes(point)
  );

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg">Settings</h2>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            toast.info("Resetting chart points to default.");
            resetChartPointsToDefault();
          }}
        >
          Reset
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-3">
        <SidebarGroup className="px-2 py-0">
          {/* tax free amount */}
          <div className="flex flex-col gap-0.5">
            <label htmlFor="tax-free-allowance" className="font-medium">
              Tax Free Allowance
            </label>
            <NumericFormat
              id="tax-free-allowance"
              className="h-8 px-2"
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
        <SidebarGroup className="px-2 py-0">
          {/* pension contribution */}
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="pension-contribution"
              className="flex flex-row justify-between"
            >
              <span className="font-medium">Pension Contribution</span>

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
              className="h-8 px-2"
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
        <SidebarGroup className="px-2 py-0">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="salaries" className="font-medium">
              Salaries
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row">
                <NumericFormat
                  id="salaries"
                  className="h-8 px-2"
                  customInput={Input}
                  prefix="£"
                  placeholder="£34,000"
                  thousandSeparator
                  value={salary}
                  onValueChange={({ floatValue }) => {
                    setSalary(floatValue?.toString() ?? "");
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      if (salary === undefined) {
                        toast.error("Please enter a valid salary.");
                        return;
                      }
                      addChartPoint(Number(salary));
                      setSalary("");
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="ml-2 h-8"
                  disabled={salary === undefined}
                  onClick={() => {
                    if (salary === undefined) {
                      toast.error("Please enter a valid salary.");
                      return;
                    }
                    addChartPoint(Number(salary));
                    setSalary("");
                  }}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              {chartPoints.length > 0 && (
                <ul className="flex flex-row gap-1 flex-wrap">
                  {chartPoints.map((point) => (
                    <li
                      key={point}
                      className="flex flex-row items-center text-xs bg-accent text-accent-foreground rounded-md"
                    >
                      <span className="px-1 py-0.5">
                        {new Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: "GBP",
                          minimumFractionDigits: 0,
                        }).format(point)}
                      </span>
                      <button
                        className="border-l border-white/50 h-full px-1 cursor-pointer"
                        onClick={() => removeChartPoint(point)}
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {usefulSalaries.length > 0 && (
                <ul className="flex flex-row gap-1 flex-wrap">
                  {usefulSalaries.map((point) => (
                    <li
                      key={point}
                      className="flex flex-row items-center text-xs bg-green-600/50 text-accent-foreground rounded-md"
                    >
                      <span className="px-1 py-0.5">
                        {new Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: "GBP",
                          minimumFractionDigits: 0,
                        }).format(point)}
                      </span>
                      <button
                        className="border-l border-white/50 h-full px-1 cursor-pointer"
                        onClick={() => addChartPoint(point)}
                      >
                        <Plus className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {/* <MultiCombobox
                className="w-full h-8 has-[>svg]:px-2"
                options={chartPoints.map((point) => ({
                  label: Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                    minimumFractionDigits: 0,
                  }).format(point),
                  value: String(point),
                }))}
                values={chartPoints.map((v) => String(v))}
                onChange={(values) =>
                  setChartPoints(values.map((v) => Number(v)))
                }
              /> */}
            </div>
          </div>
        </SidebarGroup>
        <SidebarGroup className="px-2 py-0">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="student-loans" className="font-medium">
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
                  className="flex-none text-xs"
                >
                  Plan 1
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="plan2"
                  aria-label="Toggle plan2"
                  className="flex-none text-xs"
                >
                  Plan 2
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="plan5"
                  aria-label="Toggle plan5"
                  className="flex-none text-xs"
                >
                  Plan 5
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="postgrad"
                  aria-label="Toggle postgrad"
                  className="flex-none text-xs"
                >
                  Postgraduate
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </SidebarGroup>
        <SidebarGroup className="px-2 py-0">
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="periodicity"
              className="font-medium flex flex-row justify-between"
            >
              Periodicity
            </label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={periodicity}
              onValueChange={(value: "monthly" | "yearly") => {
                if (!value) return;
                setPeriodicity(value);
              }}
              size="xs"
            >
              <ToggleGroupItem
                value="monthly"
                aria-label="Toggle monthly periodicity"
                className="flex-none text-xs"
              >
                Monthly
              </ToggleGroupItem>
              <ToggleGroupItem
                value="yearly"
                aria-label="Toggle yearly periodicity"
                className="flex-none text-xs"
              >
                Yearly
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </SidebarGroup>
        <SidebarGroup className="px-2 py-0">
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="proportional"
              className="font-medium flex flex-row justify-between"
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
                className="flex-none text-xs"
              >
                Yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="false"
                aria-label="Toggle not proportional"
                className="flex-none text-xs"
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
        <SidebarGroup className="px-2 py-0">
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor="theme"
              className="font-medium flex flex-row justify-between"
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
                className="flex-none text-xs"
              >
                Dark
              </ToggleGroupItem>
              <ToggleGroupItem
                value="light"
                aria-label="Toggle light theme"
                className="flex-none text-xs"
              >
                Light
              </ToggleGroupItem>
              <ToggleGroupItem
                value="system"
                aria-label="Toggle system theme"
                className="flex-none text-xs"
              >
                System
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </SidebarGroup>
        <SidebarGroup className="flex flex-col gap-0.5 mt-auto">
          <p className="text-xs text-muted-foreground">
            * This is not likely to be completely accurate, or regularly
            updated.
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
