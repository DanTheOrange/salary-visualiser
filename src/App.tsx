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
    color: "#f59e0b", // Yellow for pension contributions
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
    color: "#22c55e", // Bright green for take-home pay
  },
} satisfies ChartConfig;

function App() {
  const { pensionContributionType, proportional } = useChartData();
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
          <h1>Salary visualiser</h1>
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
          </AreaChart>
        </ChartContainer>
      </main>
    </>
  );
}

export default App;
