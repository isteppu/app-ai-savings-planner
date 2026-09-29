import { Income, Expenses, Goal, GoalAnalysis, Feasibility, FinancialContext } from "./types";

export function calculateTotalExpenses(expenses: Expenses): number {
  return expenses.needs.total + expenses.misc.total + expenses.wants.total;
}

export function calculateAvailableMoney(incomeAmount: number, totalExpenses: number): number {
  return Math.max(0, incomeAmount - totalExpenses);
}

export function calculateGoalFeasibility(
  goal: Goal,
  availableAmount: number
): GoalAnalysis {
  const requiredMonthlyContribution = goal.targetAmount / goal.monthsRemaining;
  const remainingBuffer = availableAmount - requiredMonthlyContribution;

  let feasibility: Feasibility;

  if (remainingBuffer > requiredMonthlyContribution * 0.5) {
    feasibility = "Comfortably achievable";
  } else if (remainingBuffer >= 0 && remainingBuffer <= requiredMonthlyContribution * 0.2) {
    feasibility = "Tight / low buffer";
  } else if (remainingBuffer >= 0) {
    feasibility = "Achievable with adjustments";
  } else {
    feasibility = "Currently unrealistic";
  }

  return {
    goal,
    requiredMonthlyContribution,
    currentAvailableMonthly: availableAmount,
    remainingBuffer,
    feasibility
  };
}

export function generateFinancialContext(
  income: Income,
  expenses: Expenses,
  goals: Goal[]
): FinancialContext {
  const totalExpenses = calculateTotalExpenses(expenses);
  const updatedExpenses = { ...expenses, total: totalExpenses };

  const conservativeIncome = income.type === "irregular" && income.lowestExpected
    ? income.lowestExpected
    : income.amount;

  const availableAmount = calculateAvailableMoney(conservativeIncome, totalExpenses);

  const goalAnalyses = goals.map(goal => calculateGoalFeasibility(goal, availableAmount));

  return {
    income,
    expenses: updatedExpenses,
    availableAmount,
    goals: goalAnalyses,
    recommendations: [] // TBD
  };
}
