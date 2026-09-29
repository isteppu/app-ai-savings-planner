"use client";

import { useFinance } from "../../lib/context/FinanceContext";
import { generateFinancialContext } from "../../lib/finance/calculations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { income, expenses, goals } = useFinance();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!income) {
      router.push("/setup/income");
    }
  }, [income, router]);

  if (!mounted || !income) return null;

  const context = generateFinancialContext(income, expenses, goals);
  
  const totalRecommendedSavings = context.goals.reduce((acc, g) => acc + g.requiredMonthlyContribution, 0);
  const remainingBuffer = context.availableAmount - totalRecommendedSavings;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  const feasibilityColor = (feasibility: string) => {
    switch(feasibility) {
      case "Comfortably achievable": return "var(--success-color)";
      case "Achievable with adjustments": return "var(--warning-color)";
      case "Tight / low buffer": return "var(--warning-color)";
      case "Currently unrealistic": return "var(--danger-color)";
      default: return "var(--text-secondary)";
    }
  };

  return (
    <main className="container flex flex-col py-6 gap-6">
      <header className="flex justify-between items-center">
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Your Financial Plan</h1>
        <Link href="/setup/income" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
          Edit Setup
        </Link>
      </header>

      {/* Overview Cards */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Overview</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Monthly Income</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "600" }}>{formatCurrency(income.amount)}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Monthly Expenses</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "600" }}>{formatCurrency(expenses.total)}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Available for Goals</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--primary-color)" }}>
              {formatCurrency(context.availableAmount)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Remaining Buffer</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "600", color: remainingBuffer >= 0 ? "var(--success-color)" : "var(--danger-color)" }}>
              {formatCurrency(remainingBuffer)}
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Your Goals</h2>
        {context.goals.length === 0 ? (
          <div className="card text-center" style={{ padding: "2rem" }}>
            <p>No savings goals yet.</p>
            <Link href="/setup/goals" className="btn btn-primary mt-4">
              + Add a Goal
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {context.goals.map((analysis) => (
              <div key={analysis.goal.id} className="card" style={{ padding: "1.25rem" }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{analysis.goal.name}</h3>
                  <span style={{ fontSize: "0.875rem", fontWeight: "500", color: feasibilityColor(analysis.feasibility) }}>
                    {analysis.feasibility}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm mb-4">
                  <span style={{ color: "var(--text-muted)" }}>Target: {formatCurrency(analysis.goal.targetAmount)}</span>
                  <span style={{ color: "var(--text-muted)" }}>Timeline: {analysis.goal.monthsRemaining} months</span>
                </div>

                <div style={{ backgroundColor: "var(--bg-color)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ fontSize: "0.875rem" }}>Required Monthly</span>
                    <span style={{ fontWeight: "600" }}>{formatCurrency(analysis.requiredMonthlyContribution)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant Stub */}
      <div className="card" style={{ padding: "1.5rem", border: "1px solid var(--primary-color)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
            AI
          </div>
          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Budget Companion</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Ask about your plan</p>
          </div>
        </div>
        <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
          I see you have {formatCurrency(context.availableAmount)} available after expenses. 
          {remainingBuffer < 0 
            ? " Right now, your goals require more than your available budget. Let's look at some adjustments!"
            : " Your goals look achievable with your current setup. How can I help you adjust or optimize this plan?"}
        </p>
        <Link href="/ai-chat" className="btn btn-primary" style={{ width: "100%" }}>
          Chat with AI Assistant
        </Link>
      </div>

    </main>
  );
}
