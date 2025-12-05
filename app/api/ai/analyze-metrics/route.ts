import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const perplexity = createOpenAICompatible({
  name: "perplexity",
  apiKey: process.env.PPLX_API_KEY!,
  baseURL: "https://api.perplexity.ai",
});

// Choisis un modèle Perplexity valide (ex: sonar-reasoning ou sonar-pro)
const sonarReasoning = perplexity("sonar-reasoning");

export async function POST(request: Request) {
  try {
    const { question, context } = await request.json();

    const contextSummary = JSON.stringify(context).slice(0, 5000);

    const prompt = `Tu es un expert en stratégie et data analytics pour des sites écotouristiques.

Ta mission :
- Analyser les indicateurs fournis (sites, employés, avis, contexte).
- Répondre à la question business du directeur.
- Répondre en français, en format markdown lisible.

Contexte (JSON tronqué) :
${contextSummary}

Question :
"${question}"

Structure attendue de la réponse (markdown) :
- Résumé global (2-3 phrases)
- Section "Insights clés" en liste à puces
- Section "Actions recommandées" en liste à puces
- Si pertinent, mentionner les risques ou points de vigilance.`;

    const { text } = await generateText({
      model: sonarReasoning,
      prompt,
      temperature: 0.7,
      maxTokens: 800,
    });

    const cleanedText = text
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .trim();

    return Response.json({
      success: true,
      analysis: cleanedText,
      source: "perplexity",
    });
  } catch (error) {
    console.error("[v0] Error analyzing metrics:", error);
    return Response.json(
      { success: false, error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
}
