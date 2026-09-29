"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFinance } from "../../../lib/context/FinanceContext";
import { IncomeType } from "../../../lib/finance/types";

export default function IncomeSetup() {
  const router = useRouter();
  const { setIncome } = useFinance();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<IncomeType>("fixed");
  const [lowest, setLowest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIncome({
      amount: parseFloat(amount),
      type,
      lowestExpected: type === "irregular" && lowest ? parseFloat(lowest) : undefined
    });
    router.push("/setup/expenses");
  };

  return (
    <main className="container flex flex-col justify-center" style={{ minHeight: "100vh" }}>
      <div className="card">
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>What's your monthly income?</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          We'll use this to figure out how much you can comfortably put towards your goals.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">{type === "fixed" ? "Monthly Amount (₱)" : "Average Monthly Amount (₱)"}</label>
            <input 
              type="number" 
              className="input" 
              placeholder="e.g. 30000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="label">Income Type</label>
            <div className="flex gap-2" style={{ marginBottom: "1rem" }}>
              <button 
                type="button"
                className={`btn ${type === "fixed" ? "btn-primary" : "btn-secondary"}`}
                style={{ flex: 1 }}
                onClick={() => setType("fixed")}
              >
                Fixed
              </button>
              <button 
                type="button"
                className={`btn ${type === "irregular" ? "btn-primary" : "btn-secondary"}`}
                style={{ flex: 1 }}
                onClick={() => setType("irregular")}
              >
                Irregular
              </button>
            </div>
            {type === "irregular" && (
              <div className="flex flex-col gap-2 mt-4">
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  If your income changes every month, we'll use a conservative estimate so your plan doesn't depend on your best month.
                </p>
                <label className="label">Lowest Expected Income (₱)</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="e.g. 20000" 
                  value={lowest}
                  onChange={(e) => setLowest(e.target.value)}
                  required={type === "irregular"}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            Next: Expenses
          </button>
        </form>
      </div>
    </main>
  );
}
