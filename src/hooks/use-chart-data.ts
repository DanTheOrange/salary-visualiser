import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { useEffect } from "react";
import { toast } from "sonner";

type ChartData = {
  gross: number;
  pension: number;
  tax: number;
  ni: number;
  net: number;
  studentLoan: number;
  postgrad: number;
}[];

// Default chart data with various income levels
// This data is used to initialize the chart and provide a baseline for future calculations
// This data comes from online calculators and is partially test data
const DEFAULT_CHART_DATA: ChartData = [
  // Starting point
  { gross: 0, pension: 0, tax: 0, ni: 0, net: 0, studentLoan: 0, postgrad: 0 },
  // Personal allowance threshold
  {
    gross: 12570,
    pension: 0,
    tax: 0,
    ni: 0,
    net: 12570,
    studentLoan: 0,
    postgrad: 0,
  },
  // Just above personal allowance
  {
    gross: 15000,
    pension: 0,
    tax: 486,
    ni: 194.4,
    net: 14319.6,
    studentLoan: 0,
    postgrad: 0,
  },
  // Mid basic rate
  {
    gross: 25000,
    pension: 0,
    tax: 2486,
    ni: 994.4,
    net: 21519.6,
    studentLoan: 0,
    postgrad: 0,
  },
  {
    gross: 35000,
    pension: 0,
    tax: 4486,
    ni: 1794.4,
    net: 28719.6,
    studentLoan: 0,
    postgrad: 0,
  },
  {
    gross: 45000,
    pension: 0,
    tax: 6486,
    ni: 2594.4,
    net: 35919.6,
    studentLoan: 0,
    postgrad: 0,
  },
  // Basic rate threshold (£50,270)
  {
    gross: 50270,
    pension: 0,
    tax: 7540,
    ni: 3016,
    net: 39714,
    studentLoan: 0,
    postgrad: 0,
  },
  // Higher rate starts
  {
    gross: 60000,
    pension: 0,
    tax: 11432,
    ni: 3210.6,
    net: 45357.4,
    studentLoan: 0,
    postgrad: 0,
  },
  {
    gross: 75000,
    pension: 0,
    tax: 17432,
    ni: 3510.6,
    net: 54057.4,
    studentLoan: 0,
    postgrad: 0,
  },
  {
    gross: 100000,
    pension: 0,
    tax: 27432,
    ni: 4010.6,
    net: 68557.4,
    studentLoan: 0,
    postgrad: 0,
  },
  // Personal allowance starts tapering (£100,000+)
  {
    gross: 110000,
    pension: 0,
    tax: 33432,
    ni: 4210.6,
    net: 72357.4,
    studentLoan: 0,
    postgrad: 0,
  },
  // Personal allowance fully tapered at £125,140
  {
    gross: 125140,
    pension: 0,
    tax: 42516,
    ni: 4513.4,
    net: 78110.6,
    studentLoan: 0,
    postgrad: 0,
  },
  // Additional rate threshold (£125,140+)
  {
    gross: 150000,
    pension: 0,
    tax: 53703,
    ni: 5010.6,
    net: 91286.4,
    studentLoan: 0,
    postgrad: 0,
  },
  {
    gross: 200000,
    pension: 0,
    tax: 76203,
    ni: 6010.6,
    net: 117786.4,
    studentLoan: 0,
    postgrad: 0,
  },
  {
    gross: 300000,
    pension: 0,
    tax: 121203,
    ni: 8010.6,
    net: 170786.4,
    studentLoan: 0,
    postgrad: 0,
  },
];

export const PENSION_CONTRIBUTION_TYPES = [
  "percentage",
  "defined",
  "none",
] as const;
export type PensionContributionType =
  (typeof PENSION_CONTRIBUTION_TYPES)[number];

export const STUDENT_LOANS = ["plan1", "plan2", "plan5", "postgrad"] as const;
export type StudentLoanPlan = (typeof STUDENT_LOANS)[number];

type StudentLoans = {
  [key in StudentLoanPlan]: boolean;
};

const DEFAULT_STUDENT_LOANS: StudentLoans = {
  plan1: false,
  plan2: false,
  plan5: false,
  postgrad: false,
};

export const PERIODICITY = ["monthly", "yearly"] as const;
export type Periodicity = (typeof PERIODICITY)[number];

interface ChartState {
  chartPoints: number[];
  chartData: ChartData;
  taxFreeAllowance: number;
  pensionContributionType: PensionContributionType;
  pensionContribution: number;
  proportional: boolean;
  studentLoans: StudentLoans;
  periodicity: Periodicity; // Optional periodicity for future use
  setChartPoints: (points: number[]) => void;
  setChartData: (data: ChartData) => void;
  setTaxFreeAllowance: (amount: number) => void;
  setPensionContributionType: (type: PensionContributionType) => void;
  setPensionContribution: (amount: number) => void;
  setProportional: (value: boolean) => void;
  setStudentLoans: (loans: StudentLoans) => void;
  setPeriodicity: (periodicity: Periodicity) => void;
}

const useChartStore = create<ChartState>()(
  devtools(
    persist(
      (set) => ({
        chartPoints: DEFAULT_CHART_DATA.map((data) => data.gross),
        chartData: DEFAULT_CHART_DATA,
        taxFreeAllowance: 12570,
        pensionContributionType: "percentage",
        pensionContribution: 0,
        proportional: false,
        studentLoans: DEFAULT_STUDENT_LOANS,
        periodicity: "yearly",
        setChartPoints: (points) => set({ chartPoints: points }),
        setChartData: (data) => set({ chartData: data }),
        setTaxFreeAllowance: (amount) => set({ taxFreeAllowance: amount }),
        setPensionContributionType: (type) =>
          set({ pensionContributionType: type }),
        setPensionContribution: (amount) =>
          set({ pensionContribution: amount }),
        setProportional: (value) => set({ proportional: value }),
        setStudentLoans: (loans) => set({ studentLoans: loans }),
        setPeriodicity: (periodicity) => set({ periodicity }),
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

const STUDENT_LOAN_BRACKETS = {
  plan1: { threshold: 26_065, rate: 0.09 },
  plan2: { threshold: 28_470, rate: 0.09 },
  plan5: { threshold: 25_000, rate: 0.09 },
  postgrad: { threshold: 21_000, rate: 0.06 },
};

const calculateChartDataPointFromGross = (
  gross: number,
  taxFreeAllowance: number,
  pensionContributionType: PensionContributionType,
  pensionContribution: number,
  studentLoans: StudentLoans
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

  const postgrad = studentLoans.postgrad
    ? Math.max(
        0,
        (adjustedGross - STUDENT_LOAN_BRACKETS.postgrad.threshold) *
          STUDENT_LOAN_BRACKETS.postgrad.rate
      )
    : 0;

  const studentLoan = Object.entries(studentLoans).reduce(
    (biggestRepayment, [plan, isActive]) => {
      if (isActive) {
        const { threshold, rate } =
          STUDENT_LOAN_BRACKETS[plan as StudentLoanPlan];
        const repayment = Math.max(0, (adjustedGross - threshold) * rate);
        return Math.max(biggestRepayment, repayment);
      }
      return biggestRepayment;
    },
    0
  );

  const net = gross - tax - ni - pension - studentLoan - postgrad;

  // console.log(
  //   `Gross: £${gross}, Pension: £${pension}, Tax: £${tax}, NI: £${ni}, Net: £${net}`
  // );

  return { gross, pension, tax, ni, net, studentLoan, postgrad };
};

export const useChartData = () => {
  const {
    chartPoints,
    chartData,
    taxFreeAllowance,
    pensionContributionType,
    pensionContribution,
    proportional,
    periodicity,
    studentLoans,
    setChartPoints,
    setChartData,
    setTaxFreeAllowance,
    setPensionContributionType,
    setPensionContribution,
    setProportional,
    setStudentLoans,
    setPeriodicity,
  } = useChartStore();

  useEffect(() => {
    // Recalculate chart data when taxFreeAllowance, pensionContributionType, or pensionContribution changes
    const newChartData = chartPoints.map((data) =>
      calculateChartDataPointFromGross(
        data,
        taxFreeAllowance,
        pensionContributionType,
        pensionContribution,
        studentLoans
      )
    );
    setChartData(newChartData);
  }, [
    chartPoints,
    taxFreeAllowance,
    pensionContributionType,
    pensionContribution,
    studentLoans,
    periodicity,
    setChartData,
  ]);

  const resetChartPointsToDefault = () => {
    setChartPoints(DEFAULT_CHART_DATA.map((data) => data.gross));
    setTaxFreeAllowance(12570);
    setPensionContributionType("percentage");
    setPensionContribution(0);
    setStudentLoans(DEFAULT_STUDENT_LOANS);
  };

  const addChartPoint = (point: number) => {
    if (chartPoints.includes(point)) {
      toast.info("Can't create duplicate points.");
      return;
    }

    setChartPoints([...chartPoints, point].sort((a, b) => a - b));
  };

  const removeChartPoint = (index: number) => {
    setChartPoints(chartPoints.filter((point) => point !== index));
  };

  const updateTaxFreeAllowance = (amount: number) => {
    setTaxFreeAllowance(amount);
  };

  const updatePensionContributionType = (type: PensionContributionType) => {
    setPensionContributionType(type);
    if (type === "percentage") {
      setPensionContribution(Math.min(100, Math.max(pensionContribution, 0))); // Default to 5% if percentage
    }
  };

  const updatePensionContribution = (amount: number) => {
    setPensionContribution(amount);
  };

  const updateStudentLoans = (loans: StudentLoans) => {
    setStudentLoans(loans);
  };

  return {
    chartData,
    chartPoints: chartData.map(({ gross }) => gross),
    taxFreeAllowance,
    pensionContributionType,
    pensionContribution,
    proportional,
    studentLoans,
    periodicity,
    setChartPoints,
    addChartPoint,
    removeChartPoint,
    resetChartPointsToDefault,
    updateTaxFreeAllowance,
    updatePensionContributionType,
    updatePensionContribution,
    setProportional,
    updateStudentLoans,
    setPeriodicity,
  };
};
