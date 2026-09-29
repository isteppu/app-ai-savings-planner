"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFinance } from "../../../lib/context/FinanceContext";
import { Priority, Goal } from "../../../lib/finance/types";

export default function GoalsSetup() {
  const router = useRouter();
  const { addGoal, goals } = useFinance();
  
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [priority, setPriority] = useState<Priority>("High");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !months) return;

    const newGoal: Goal = {
      id: Math.random().toString(),
      name,
      targetAmount: parseFloat(amount),
      monthsRemaining: parseInt(months, 10),
      priority
    };

    addGoal(newGoal);
    setName("");
    setAmount("");
    setMonths("");
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  return (
    <main className="container flex flex-col justify-center py-8" style={{ minHeight: "100vh" }}>
      <div className="card">
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>What are you saving for?</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          Add your savings goals. We'll help you figure out if you can afford them and how long it will take.
        </p>

        {goals.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Your Goals</h3>
            {goals.map((g) => (
              <div key={g.id} className="flex justify-between items-center p-3 rounded" style={{ backgroundColor: "var(--bg-color)", border: "1px solid var(--border-color)" }}>
                <div>
                  <div style={{ fontWeight: "600" }}>{g.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    ₱{g.targetAmount} in {g.monthsRemaining} months ({g.priority} priority)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddGoal} className="flex flex-col gap-4 mt-4 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Add New Goal</h3>
          
          <div>
            <label className="label">Goal Name</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Laptop, Japan Trip" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="flex gap-4">
            <div style={{ flex: 1 }}>
              <label className="label">Target Amount (₱)</label>
              <input 
                type="number" 
                className="input" 
                placeholder="e.g. 45000" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">In How Many Months?</label>
              <input 
                type="number" 
                className="input" 
                placeholder="e.g. 6" 
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                required 
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="label">Priority</label>
            <div className="flex gap-2">
              {["High", "Medium", "Low"].map((p) => (
                <button 
                  key={p}
                  type="button"
                  className={`btn ${priority === p ? "btn-primary" : "btn-secondary"}`}
                  style={{ flex: 1, padding: "0.5rem" }}
                  onClick={() => setPriority(p as Priority)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-secondary mt-2">
            + Add Goal
          </button>
        </form>

        <button 
          onClick={handleFinish} 
          className="btn btn-primary mt-6" 
          style={{ width: "100%" }}
          disabled={goals.length === 0 && !name}
        >
          {goals.length === 0 ? "Calculate Plan" : "Calculate My Plan"}
        </button>
      </div>
    </main>
  );
}
