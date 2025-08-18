import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

type ChartData = {
  gross: number;
  pension: number;
  tax: number;
  ni: number;
  net: number;
}[];

// Default chart data with various income levels
// This data is used to initialize the chart and provide a baseline for future calculations
// This data comes from online calculators and is partially test data
const DEFAULT_CHART_DATA: ChartData = [
  // Starting point
  { gross: 0, pension: 0, tax: 0, ni: 0, net: 0 },
  // Personal allowance threshold
  { gross: 12570, pension: 0, tax: 0, ni: 0, net: 12570 },
  // Just above personal allowance
  { gross: 15000, pension: 0, tax: 486, ni: 194.4, net: 14319.6 },
  // Mid basic rate
  { gross: 25000, pension: 0, tax: 2486, ni: 994.4, net: 21519.6 },
  { gross: 35000, pension: 0, tax: 4486, ni: 1794.4, net: 28719.6 },
  { gross: 45000, pension: 0, tax: 6486, ni: 2594.4, net: 35919.6 },
  // Basic rate threshold (£50,270)
  { gross: 50270, pension: 0, tax: 7540, ni: 3016, net: 39714 },
  // Higher rate starts
  { gross: 60000, pension: 0, tax: 11432, ni: 3210.6, net: 45357.4 },
  { gross: 75000, pension: 0, tax: 17432, ni: 3510.6, net: 54057.4 },
  { gross: 100000, pension: 0, tax: 27432, ni: 4010.6, net: 68557.4 },
  // Personal allowance starts tapering (£100,000+)
  { gross: 110000, pension: 0, tax: 33432, ni: 4210.6, net: 72357.4 },
  // Personal allowance fully tapered at £125,140
  { gross: 125140, pension: 0, tax: 42516, ni: 4513.4, net: 78110.6 },
  // Additional rate threshold (£125,140+)
  { gross: 150000, pension: 0, tax: 53703, ni: 5010.6, net: 91286.4 },
  { gross: 200000, pension: 0, tax: 76203, ni: 6010.6, net: 117786.4 },
  { gross: 300000, pension: 0, tax: 121203, ni: 8010.6, net: 170786.4 },
];

export const PENSION_CONTRIBUTION_TYPES = [
  "percentage",
  "defined",
  "none",
] as const;
export type PensionContributionType =
  (typeof PENSION_CONTRIBUTION_TYPES)[number];

interface ChartState {
  chartData: ChartData;
  taxFreeAllowance: number;
  pensionContributionType: PensionContributionType;
  pensionContribution: number;
  proportional: boolean;
  setChartData: (data: ChartData) => void;
  setTaxFreeAllowance: (amount: number) => void;
  setPensionContributionType: (type: PensionContributionType) => void;
  setPensionContribution: (amount: number) => void;
  setProportional: (value: boolean) => void;
}

const useChartStore = create<ChartState>()(
  devtools(
    persist(
      (set) => ({
        chartData: DEFAULT_CHART_DATA,
        taxFreeAllowance: 12570,
        pensionContributionType: "percentage",
        pensionContribution: 0,
        proportional: false,
        setChartData: (data) => set({ chartData: data }),
        setTaxFreeAllowance: (amount) => set({ taxFreeAllowance: amount }),
        setPensionContributionType: (type) =>
          set({ pensionContributionType: type }),
        setPensionContribution: (amount) =>
          set({ pensionContribution: amount }),
        setProportional: (value) => set({ proportional: value }),
      }),
      {
        name: "chart-storage",
      }
    )
  )
);

const TAX_BRACKETS = [
  { threshold: 0, rate: 0 }, // No tax on your tax free allowance
  { threshold: 37_701, rate: 0.2 }, // Basic rate
  { threshold: 125_141, rate: 0.4 }, // Higher rate
  { threshold: Infinity, rate: 0.45 }, // Additional rate
];

const NI_BRACKETS = [
  { threshold: 12_571, rate: 0.0 }, // £0 – £12,570 (Primary Threshold): no employee NI
  { threshold: 50_271, rate: 0.08 }, // £12,571 – £50,270 (to UEL): 8%
  { threshold: Infinity, rate: 0.02 }, // Over £50,270: 2%
];

const calculateChartDataPointFromGross = (
  gross: number,
  taxFreeAllowance: number,
  pensionContributionType: PensionContributionType,
  pensionContribution: number
) => {
  // Adjust based on pension contribution
  let adjustedGross = gross;
  let pension = 0;
  if (pensionContributionType === "percentage") {
    pension = (gross * pensionContribution) / 100;
  } else if (pensionContributionType === "defined") {
    pension = pensionContribution;
  }

  if (pension > gross) {
    pension = gross;
  }

  adjustedGross -= pension;

  // adjust tax free allowance based on gross earnings
  let newTaxFreeAllowance = taxFreeAllowance;

  if (adjustedGross > 100_000) {
    newTaxFreeAllowance = Math.min(
      Math.max(0, taxFreeAllowance - (adjustedGross - 100_000) / 2),
      taxFreeAllowance
    );
  }

  const tax = TAX_BRACKETS.reduce((acc, { threshold, rate }, index) => {
    const adjustedThreshold = threshold + newTaxFreeAllowance;

    // console.log({
    //   adjustedGross,
    //   adjustedThreshold,
    //   rate,
    //   taxableInBand:
    //     Math.min(adjustedGross, adjustedThreshold) -
    //     TAX_BRACKETS[Math.max(index - 1, 0)].threshold -
    //     newTaxFreeAllowance,
    //   tax: Math.max(
    //     (Math.min(adjustedGross, adjustedThreshold) -
    //       TAX_BRACKETS[Math.max(index - 1, 0)].threshold -
    //       newTaxFreeAllowance) *
    //       rate,
    //     0
    //   ),
    //   taxxed: adjustedGross > adjustedThreshold,
    // });

    acc =
      acc +
      Math.max(
        (Math.min(adjustedGross, adjustedThreshold) -
          TAX_BRACKETS[Math.max(index - 1, 0)].threshold -
          newTaxFreeAllowance) *
          rate,
        0
      );

    return acc;
  }, 0);

  const ni = NI_BRACKETS.reduce((acc, { threshold, rate }, index) => {
    // console.log({
    //   adjustedGross,
    //   rate,
    //   taxableInBand:
    //     Math.min(adjustedGross, threshold) -
    //     TAX_BRACKETS[Math.max(index - 1, 0)].threshold,
    //   tax: Math.max(
    //     (Math.min(adjustedGross, threshold) -
    //       TAX_BRACKETS[Math.max(index - 1, 0)].threshold) *
    //       rate,
    //     0
    //   ),
    //   taxxed: adjustedGross > threshold,
    // });

    acc =
      acc +
      Math.max(
        (Math.min(adjustedGross, threshold) -
          NI_BRACKETS[Math.max(index - 1, 0)].threshold) *
          rate,
        0
      );
    return acc;
  }, 0);

  const net = gross - tax - ni - pension;

  // console.log(
  //   `Gross: £${gross}, Pension: £${pension}, Tax: £${tax}, NI: £${ni}, Net: £${net}`
  // );

  return { gross, pension, tax, ni, net };
};

export const useChartData = () => {
  const {
    chartData,
    taxFreeAllowance,
    pensionContributionType,
    pensionContribution,
    proportional,
    setChartData,
    setTaxFreeAllowance,
    setPensionContributionType,
    setPensionContribution,
    setProportional,
  } = useChartStore();

  const addChartPoint = (gross: number) => {
    const point = {
      gross,
      pension: 0,
      tax: 0,
      ni: 0,
      net: gross,
    };

    const newChartData = [...chartData, point]
      .sort((a, b) => a.gross - b.gross)
      .map((data) =>
        calculateChartDataPointFromGross(
          data.gross,
          taxFreeAllowance,
          pensionContributionType,
          pensionContribution
        )
      );

    setChartData(newChartData);
  };

  const removeChartPoint = (gross: number) => {
    const newData = chartData.filter((point) => point.gross !== gross);
    setChartData(newData);
  };

  const resetChartPointsToDefault = () => {
    setChartData(DEFAULT_CHART_DATA);
    setTaxFreeAllowance(12570);
    setPensionContributionType("percentage");
    setPensionContribution(0);
  };

  const updateTaxFreeAllowance = (amount: number) => {
    setTaxFreeAllowance(amount);
    const newChartData = chartData.map((data) =>
      calculateChartDataPointFromGross(
        data.gross,
        amount,
        pensionContributionType,
        pensionContribution
      )
    );
    setChartData(newChartData);
  };

  const updatePensionContributionType = (type: PensionContributionType) => {
    setPensionContributionType(type);
    if (type === "percentage") {
      setPensionContribution(Math.min(100, Math.max(pensionContribution, 0))); // Default to 5% if percentage
    }
    const newChartData = chartData.map((data) =>
      calculateChartDataPointFromGross(
        data.gross,
        taxFreeAllowance,
        type,
        pensionContribution
      )
    );
    setChartData(newChartData);
  };

  const updatePensionContribution = (amount: number) => {
    setPensionContribution(amount);
    const newChartData = chartData.map((data) =>
      calculateChartDataPointFromGross(
        data.gross,
        taxFreeAllowance,
        pensionContributionType,
        amount
      )
    );
    setChartData(newChartData);
  };

  return {
    chartData,
    chartPoints: chartData.map(({ gross }) => gross),
    taxFreeAllowance,
    pensionContributionType,
    pensionContribution,
    proportional,
    addChartPoint,
    removeChartPoint,
    resetChartPointsToDefault,
    updateTaxFreeAllowance,
    updatePensionContributionType,
    updatePensionContribution,
    setProportional,
  };
};
