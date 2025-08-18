import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type CustomTooltipProps,
  type ChartConfig,
} from "~/components/ui/chart";
import { ChartContainer } from "~/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { useChartData } from "./hooks/use-chart-data";
import { Separator } from "./components/ui/separator";

const chartConfig = {
  pension: {
    label: "Pension",
    color: "#09e193", // Light Green for pension contributions
  },
  ni: {
    label: "NI",
    color: "#3b82f6", // Blue for National Insurance
  },
  tax: {
    label: "Tax",
    color: "#ef4444", // Red for tax
  },
  net: {
    label: "Net",
    color: "#009f3b", // green for take-home pay
  },
  studentLoan: {
    label: "Student Loan",
    color: "#f59e0b",
  },
  postgrad: {
    label: "Postgrad Loan",
    color: "#955400",
  },
} satisfies ChartConfig;

function App() {
  const { pensionContributionType, studentLoans, proportional } =
    useChartData();
  const { chartData } = useChartData();

  return (
    <>
      <AppSidebar />
      <main className="m-4 max-h-screen overflow-none w-full">
        <div className="flex items-center mb-4">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="ml-2 mr-4 data-[orientation=vertical]:h-4"
          />
          <h1>Salary Visualiser</h1>
        </div>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[calc(100vh_-_5.5rem)] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
            stackOffset={proportional ? "expand" : undefined}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="gross"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Intl.NumberFormat().format(value)}
            />
            <ChartTooltip
              cursor={false}
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent
                  {...props}
                  indicator="line"
                  labelKey="gross"
                  labelFormatter={(value) =>
                    new Intl.NumberFormat().format(value)
                  }
                  showPercent
                />
              )}
            />
            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            <Area
              dataKey="ni"
              fill="var(--color-ni)"
              fillOpacity={0.2}
              stroke="var(--color-ni)"
              stackId="a"
            />
            <Area
              dataKey="tax"
              fill="var(--color-tax)"
              fillOpacity={0.2}
              stroke="var(--color-tax)"
              stackId="a"
            />
            <Area
              dataKey="net"
              fill="var(--color-net)"
              fillOpacity={0.2}
              stroke="var(--color-net)"
              stackId="a"
            />
            {pensionContributionType !== "none" && (
              <Area
                dataKey="pension"
                fill="var(--color-pension)"
                fillOpacity={0.2}
                stroke="var(--color-pension)"
                stackId="a"
              />
            )}
            {(studentLoans.plan1 === true ||
              studentLoans.plan2 === true ||
              studentLoans.plan5 === true) && (
              <Area
                dataKey="studentLoan"
                fill="var(--color-studentLoan)"
                fillOpacity={0.2}
                stroke="var(--color-studentLoan)"
                stackId="a"
              />
            )}
            {studentLoans.postgrad === true && (
              <Area
                dataKey="postgrad"
                fill="var(--color-postgrad)"
                fillOpacity={0.2}
                stroke="var(--color-postgrad)"
                stackId="a"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </main>
    </>
  );
}

export default App;
