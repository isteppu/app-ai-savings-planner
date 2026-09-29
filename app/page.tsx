import Link from "next/link";

export default function Home() {
  return (
    <main className="container flex flex-col items-center justify-center" style={{ minHeight: "100vh" }}>
      <div className="card text-center flex flex-col items-center" style={{ padding: "3rem 1.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>
          AI Budgeting & Savings Planner
        </h1>
        <p style={{ fontSize: "1.125rem", maxWidth: "400px", margin: "0 auto 2rem" }}>
          See what you can realistically afford. Plan your savings without the guilt trip.
        </p>
        
        <Link href="/setup/income" className="btn btn-primary" style={{ width: "100%" }}>
          Build My Plan
        </Link>
      </div>
    </main>
  );
}
