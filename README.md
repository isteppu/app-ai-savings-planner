# AI Budgeting & Savings Planner

Personal budgeting and savings planning web application built with **Next.js**, **TypeScript**, and **Google Gemini AI**.

The core idea is simple: Users enter their income, expenses, and savings goals. The application calculates what they can realistically afford, how much they need to save, how long it will take, and what they can adjust to reach their goals. An AI assistant then explains the results in simple, encouraging, non-judgmental language and lets users ask "what if" questions.

## Core Features

- **Mobile-First Design**: Clean, modern interface designed specifically for mobile devices.
- **Deterministic Financial Engine**: All numbers are calculated deterministically (not by AI) to ensure accurate, mathematically sound financial planning.
- **Adaptive Budgeting**: Calculates feasibility, timelines, and required monthly contributions based on your specific situation.
- **AI Chat Companion**: Integrates with Google Gemini to offer friendly, non-judgmental explanations and scenario generation based strictly on your calculated financial context.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up your environment variables:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Add your Google Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **Next.js App Router**: Powers the application layout and routing.
- **Vanilla CSS**: Global styles and tokens located in `app/globals.css`.
- **`lib/finance`**: Contains the core logic, types, and deterministic calculations.
- **`lib/context`**: Houses the global React Context (`FinanceContext`) to share user data across the setup flow and dashboard.
- **`app/api/chat/route.ts`**: The serverless route handling secure communication with the Google Gemini SDK.

## AI Safety Principle

This app operates under a strict principle: **The AI is not responsible for financial calculations**. The calculation engine does the math, and the AI interprets the output to act as a supportive planning tool, not a certified financial advisor.
