import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { ChartContainer } from "~/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useState } from "react";
import { Switch } from "~/components/ui/switch";
import { ModeToggle } from "./components/mode-toggle";

type ChartData = {
  gross: number;
  tax: number;
  ni: number;
  net: number;
}[];

const chartData: ChartData = [
  // Starting point
  { gross: 1, tax: 0, ni: 0, net: 1 },
  // Personal allowance threshold
  { gross: 12570, tax: 0, ni: 0, net: 12570 },
  // Just above personal allowance
  { gross: 15000, tax: 486, ni: 194.4, net: 14319.6 },
  // Mid basic rate
  { gross: 25000, tax: 2486, ni: 994.4, net: 21519.6 },
  { gross: 35000, tax: 4486, ni: 1794.4, net: 28719.6 },
  { gross: 45000, tax: 6486, ni: 2594.4, net: 35919.6 },
  // Basic rate threshold (£50,270)
  { gross: 50270, tax: 7540, ni: 3016, net: 39714 },
  // Higher rate starts
  { gross: 60000, tax: 11432, ni: 3210.6, net: 45357.4 },
  { gross: 75000, tax: 17432, ni: 3510.6, net: 54057.4 },
  { gross: 100000, tax: 27432, ni: 4010.6, net: 68557.4 },
  // Personal allowance starts tapering (£100,000+)
  { gross: 110000, tax: 33432, ni: 4210.6, net: 72357.4 },
  // Personal allowance fully tapered at £125,140
  { gross: 125140, tax: 42516, ni: 4513.4, net: 78110.6 },
  // Additional rate threshold (£125,140+)
  { gross: 150000, tax: 53703, ni: 5010.6, net: 91286.4 },
  { gross: 200000, tax: 76203, ni: 6010.6, net: 117786.4 },
  { gross: 300000, tax: 121203, ni: 8010.6, net: 170786.4 },
];

const chartConfig = {
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
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="m-4">
      <div className="flex items-center justify-between mb-4">
        <h1>Salary visualiser</h1>
        <div className="flex items-center gap-2">
          <Switch
            checked={expanded}
            onCheckedChange={setExpanded}
            className="ml-4"
          />
          Proportional
          <ModeToggle />
        </div>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
          }}
          stackOffset={expanded ? "expand" : undefined}
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
            content={
              <ChartTooltipContent
                indicator="line"
                labelKey="gross"
                labelFormatter={(value) =>
                  new Intl.NumberFormat().format(value)
                }
              />
            }
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
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

export default App;
