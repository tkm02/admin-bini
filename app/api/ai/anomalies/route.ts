import { Anthropic } from "@anthropic-ai/sdk"
import { buildAnomalyPrompt } from "@/lib/prompts/prompt-builder"
import type { DashboardContext } from "@/lib/types/ai-context"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { context } = await request.json()

    if (!context) {
      return new Response(JSON.stringify({ error: "Missing context" }), {
        status: 400,
      })
    }

    const prompt = buildAnomalyPrompt(context as DashboardContext)

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    })

    if (message.content[0].type !== "text") {
      throw new Error("Unexpected response type")
    }

    return new Response(
      JSON.stringify({
        analysis: message.content[0].text,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("[Anomaly Detection Error]", error)
    return new Response(JSON.stringify({ error: "Failed to detect anomalies" }), {
      status: 500,
    })
  }
}
