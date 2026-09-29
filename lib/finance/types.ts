export type IncomeType = "fixed" | "irregular";

export interface Income {
  amount: number;
  type: IncomeType;
  lowestExpected?: number;
  highestExpected?: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export interface ExpenseCategory {
  items: ExpenseItem[];
  total: number;
}

export interface Expenses {
  needs: ExpenseCategory;
  misc: ExpenseCategory;
  wants: ExpenseCategory;
  total: number;
}

export type Priority = "Low" | "Medium" | "High";

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  monthsRemaining: number;
  priority: Priority;
}

export type Feasibility =
  | "Comfortably achievable"
  | "Achievable with adjustments"
  | "Tight / low buffer"
  | "Currently unrealistic";

export interface GoalAnalysis {
  goal: Goal;
  requiredMonthlyContribution: number;
  currentAvailableMonthly: number;
  remainingBuffer: number;
  feasibility: Feasibility;
}

export interface Recommendation {
  id: string;
  description: string;
  type: "timeline" | "budget_cut" | "income_increase";
  impact: string;
}

export interface FinancialContext {
  income: Income;
  expenses: Expenses;
  availableAmount: number;
  goals: GoalAnalysis[];
  recommendations: Recommendation[];
}

export interface Scenario {
  id: string;
  name: string;
  income: Income;
  expenses: Expenses;
  goals: Goal[];
}
