"use client";

import { useFinance } from "../../lib/context/FinanceContext";
import { generateFinancialContext } from "../../lib/finance/calculations";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function AIChat() {
  const { income, expenses, goals } = useFinance();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const financeContext = useMemo(() => {
    if (!income) return null;
    return generateFinancialContext(income, expenses, goals);
  }, [income, expenses, goals]);

  useEffect(() => {
    setMounted(true);
    if (!income) {
      router.push("/setup/income");
    } else if (messages.length === 0 && financeContext) {
      const remainingBuffer = financeContext.availableAmount - financeContext.goals.reduce((acc, g) => acc + g.requiredMonthlyContribution, 0);
      
      const formatCurrency = (amount: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

      let initialMessage = `Hi! I'm your Budget Companion. I see you have ${formatCurrency(financeContext.availableAmount)} available for goals each month.`;
      
      if (remainingBuffer < 0) {
        initialMessage += ` Currently, your goals require more than your available budget (shortfall of ${formatCurrency(Math.abs(remainingBuffer))}). We can look at adjusting timelines, cutting some 'Wants', or increasing income. What would you like to explore?`;
      } else {
        initialMessage += ` Your goals are perfectly achievable with a remaining buffer of ${formatCurrency(remainingBuffer)}. Want to run any "what if" scenarios, like adjusting a goal timeline or adding a new expense?`;
      }
      
      setMessages([{ role: "assistant", content: initialMessage }]);
    }
  }, [income, router, messages.length, financeContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({ role: msg.role, content: msg.content })),
          context: financeContext
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: data.role, content: data.content }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble connecting to the server. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !income) return null;

  return (
    <main className="container flex flex-col py-6" style={{ height: "100vh", maxHeight: "100vh" }}>
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="btn btn-secondary" style={{ padding: "0.5rem", borderRadius: "var(--radius-full)" }}>
            ←
          </Link>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "600" }}>AI Companion</h1>
        </div>
      </header>

      <div className="card flex-1 flex flex-col" style={{ padding: "0", overflow: "hidden", display: "flex" }}>
        
        <div className="flex-1 overflow-y-auto" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div 
                style={{ 
                  maxWidth: "85%", 
                  padding: "0.75rem 1rem", 
                  borderRadius: "1rem",
                  backgroundColor: msg.role === "user" ? "var(--primary-color)" : "var(--bg-color)",
                  color: msg.role === "user" ? "white" : "var(--text-primary)",
                  border: msg.role === "user" ? "none" : "1px solid var(--border-color)",
                  borderBottomRightRadius: msg.role === "user" ? "0.25rem" : "1rem",
                  borderBottomLeftRadius: msg.role === "assistant" ? "0.25rem" : "1rem",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div style={{ padding: "0.75rem 1rem", borderRadius: "1rem", backgroundColor: "var(--bg-color)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: "1rem", borderTop: "1px solid var(--border-color)", backgroundColor: "var(--card-bg)" }}>
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              className="input" 
              placeholder="Ask about your budget..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1, borderRadius: "var(--radius-full)" }}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ padding: "0.5rem 1.5rem", borderRadius: "var(--radius-full)", opacity: isLoading ? 0.7 : 1 }}>
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
