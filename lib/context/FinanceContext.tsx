"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Income, Expenses, Goal, GoalAnalysis, Recommendation } from "../finance/types";

interface FinanceState {
  income: Income | null;
  expenses: Expenses;
  goals: Goal[];
  setIncome: (income: Income) => void;
  updateExpenses: (category: keyof Expenses, newTotal: number, items: any[]) => void;
  addGoal: (goal: Goal) => void;
}

const defaultExpenses: Expenses = {
  needs: { items: [], total: 0 },
  misc: { items: [], total: 0 },
  wants: { items: [], total: 0 },
  total: 0
};

const FinanceContext = createContext<FinanceState | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [income, setIncomeState] = useState<Income | null>(null);
  const [expenses, setExpensesState] = useState<Expenses>(defaultExpenses);
  const [goals, setGoalsState] = useState<Goal[]>([]);

  const setIncome = (newIncome: Income) => {
    setIncomeState(newIncome);
  };

  const updateExpenses = (category: keyof Expenses, newTotal: number, items: any[]) => {
    if (category === "total") return;
    
    setExpensesState(prev => {
      const updatedCategory = { items, total: newTotal };
      const nextState = { ...prev, [category]: updatedCategory };
      nextState.total = nextState.needs.total + nextState.misc.total + nextState.wants.total;
      return nextState;
    });
  };

  const addGoal = (goal: Goal) => {
    setGoalsState(prev => [...prev, goal]);
  };

  return (
    <FinanceContext.Provider value={{ income, expenses, goals, setIncome, updateExpenses, addGoal }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
