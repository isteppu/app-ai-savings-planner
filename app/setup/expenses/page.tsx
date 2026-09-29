"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFinance } from "../../../lib/context/FinanceContext";

type Category = "needs" | "misc" | "wants";

interface LocalItem {
  id: string;
  name: string;
  amount: string;
}

export default function ExpensesSetup() {
  const router = useRouter();
  const { updateExpenses } = useFinance();
  
  const [needs, setNeeds] = useState<LocalItem[]>([{ id: "1", name: "", amount: "" }]);
  const [misc, setMisc] = useState<LocalItem[]>([{ id: "1", name: "", amount: "" }]);
  const [wants, setWants] = useState<LocalItem[]>([{ id: "1", name: "", amount: "" }]);

  const handleAddItem = (category: Category) => {
    const newItem = { id: Math.random().toString(), name: "", amount: "" };
    if (category === "needs") setNeeds([...needs, newItem]);
    if (category === "misc") setMisc([...misc, newItem]);
    if (category === "wants") setWants([...wants, newItem]);
  };

  const handleUpdateItem = (category: Category, id: string, field: "name" | "amount", value: string) => {
    const updater = (prev: LocalItem[]) => prev.map(item => item.id === id ? { ...item, [field]: value } : item);
    if (category === "needs") setNeeds(updater);
    if (category === "misc") setMisc(updater);
    if (category === "wants") setWants(updater);
  };

  const handleRemoveItem = (category: Category, id: string) => {
    const updater = (prev: LocalItem[]) => prev.filter(item => item.id !== id);
    if (category === "needs") setNeeds(updater);
    if (category === "misc") setMisc(updater);
    if (category === "wants") setWants(updater);
  };

  const parseItems = (items: LocalItem[]) => {
    return items
      .filter(i => i.name.trim() !== "" && i.amount !== "")
      .map(i => ({ id: i.id, name: i.name, amount: parseFloat(i.amount) }));
  };

  const calcTotal = (items: LocalItem[]) => {
    return items.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExpenses("needs", calcTotal(needs), parseItems(needs));
    updateExpenses("misc", calcTotal(misc), parseItems(misc));
    updateExpenses("wants", calcTotal(wants), parseItems(wants));
    
    router.push("/setup/goals");
  };

  const renderCategory = (title: string, desc: string, items: LocalItem[], category: Category) => (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{title} (₱{calcTotal(items)})</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{desc}</p>
      </div>
      
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div key={item.id} className="flex gap-2 items-center">
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Rent" 
              value={item.name}
              onChange={(e) => handleUpdateItem(category, item.id, "name", e.target.value)}
              style={{ flex: 2 }}
            />
            <input 
              type="number" 
              className="input" 
              placeholder="₱" 
              value={item.amount}
              onChange={(e) => handleUpdateItem(category, item.id, "amount", e.target.value)}
              style={{ flex: 1 }}
            />
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => handleRemoveItem(category, item.id)}
              style={{ padding: "0.5rem 1rem", color: "var(--danger-color)" }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      <button 
        type="button" 
        className="btn btn-secondary mt-4" 
        style={{ width: "100%", fontSize: "0.875rem" }}
        onClick={() => handleAddItem(category)}
      >
        + Add Expense
      </button>
    </div>
  );

  return (
    <main className="container flex flex-col justify-center py-8">
      <div className="card">
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Monthly Expenses</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          Let's break down where your money goes. Don't worry about being perfect.
        </p>

        <form onSubmit={handleSubmit}>
          {renderCategory(
            "Needs", 
            "Essentials like rent, groceries, utilities.", 
            needs, 
            "needs"
          )}
          
          {renderCategory(
            "Misc", 
            "Irregular but necessary like subscriptions, medical.", 
            misc, 
            "misc"
          )}
          
          {renderCategory(
            "Wants", 
            "Fun stuff like eating out, shopping, hobbies.", 
            wants, 
            "wants"
          )}

          <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
            <span style={{ fontWeight: "600" }}>Total Expenses</span>
            <span style={{ fontWeight: "600", fontSize: "1.25rem" }}>
              ₱{calcTotal(needs) + calcTotal(misc) + calcTotal(wants)}
            </span>
          </div>

          <button type="submit" className="btn btn-primary mt-6" style={{ width: "100%" }}>
            Next: Savings Goals
          </button>
        </form>
      </div>
    </main>
  );
}
