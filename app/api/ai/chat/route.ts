import { Anthropic } from "@anthropic-ai/sdk"
import { buildPrompt } from "@/lib/prompts/prompt-builder"
import type { DashboardContext, AIResponse } from "@/lib/types/ai-context"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { question, context, type = "conversational" } = await request.json()

    if (!question || !context) {
      return new Response(JSON.stringify({ error: "Missing question or context" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const prompt = buildPrompt(question, context as DashboardContext, type)

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const responseContent = message.content[0]
    if (responseContent.type !== "text") {
      throw new Error("Unexpected response type from Claude")
    }

    const aiResponse: AIResponse = {
      type: type as any,
      content: responseContent.text,
      timestamp: new Date().toISOString(),
    }

    return new Response(JSON.stringify(aiResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[AI Chat Error]", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process AI request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
