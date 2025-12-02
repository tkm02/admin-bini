import { Anthropic } from "@anthropic-ai/sdk"
import { buildPrompt } from "@/lib/prompts/prompt-builder"
import type { DashboardContext } from "@/lib/types/ai-context"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { context, focus = "all" } = await request.json()

    if (!context) {
      return new Response(JSON.stringify({ error: "Missing context" }), {
        status: 400,
      })
    }

    const types = focus === "all" ? ["commercial", "operational", "team"] : [focus]

    const recommendations = []

    for (const type of types) {
      const prompt = buildPrompt(
        `Donne-moi les 3 recommandations PRIORITAIRES pour améliorer la performance ${type === "commercial" ? "commerciale" : type === "operational" ? "opérationnelle" : "de l'équipe"}. Sois concis et actionnable.`,
        context as DashboardContext,
        type as any,
      )

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      })

      if (message.content[0].type === "text") {
        recommendations.push({
          focus: type,
          content: message.content[0].text,
        })
      }
    }

    return new Response(JSON.stringify({ recommendations }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[Recommendations Error]", error)
    return new Response(JSON.stringify({ error: "Failed to generate recommendations" }), {
      status: 500,
    })
  }
}
