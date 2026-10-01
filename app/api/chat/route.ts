import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          role: "assistant",
          content: "The required API configuration is missing on the server. Please check your deployment settings."
        },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt = `You are a friendly financial planning companion. 
Your role is to explain calculated results, translate numbers into plain language, suggest trade-offs, answer user questions, and generate alternative scenarios based on calculated data.
DO NOT independently invent or calculate financial figures. The deterministic calculation engine has already processed the user's financial context. 
Tone: Friendly, Clear, Encouraging, Non-judgmental, Practical, Concise.
Avoid: Shaming, Fear-based language, Condescending language, "You should have known better", Overly formal financial terminology.

User's Financial Context:
${JSON.stringify(context, null, 2)}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      systemInstruction: systemPrompt
    });

    const lastMessage = messages[messages.length - 1].content;

    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    while (history.length > 0 && history[0].role === "model") {
      history.shift();
    }
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
      }
    });

    async function sendMessageWithRetry(chat: any, lastMessage: string, retries = 3, delay = 1000) {
      for (let i = 0; i < retries; i++) {
        try {
          return await chat.sendMessage(lastMessage);
        } catch (err: any) {
          if (err?.status === 503 && i < retries - 1) {
            await new Promise((res) => setTimeout(res, delay * Math.pow(2, i))); // 1s, 2s, 4s
            continue;
          }
          throw err;
        }
      }
    }

    const result = await sendMessageWithRetry(chat, lastMessage);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      role: "assistant",
      content: text || "I'm not quite sure how to respond to that."
    });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: "An error occurred during your request." },
      { status: 500 }
    );
  }
}
