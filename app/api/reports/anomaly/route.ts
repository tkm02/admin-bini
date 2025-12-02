import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const perplexity = createOpenAICompatible({
  name: "perplexity",
  apiKey: process.env.PPLX_API_KEY!,
  baseURL: "https://api.perplexity.ai",
});

// ex : sonar-reasoning ou sonar-pro selon ce qui est dispo sur ton compte [web:2][web:19]
const sonarReasoning = perplexity("sonar-reasoning");

const anomalyPrompts: Record<string, string> = {
  "revenue-drop":
    "Analyse la baisse de revenus détectée et propose un plan d'action d'urgence.",
  "low-occupancy":
    "Évalue la faible occupation et recommande des stratégies commerciales immédiates.",
  "negative-sentiment":
    "Analyse les avis négatifs et propose des correctifs prioritaires.",
  "staff-absence":
    "Évalue l'impact des absences et propose un plan de redéploiement.",
  "site-closure":
    "Analyse l'impact de la fermeture du site et propose un plan de continuité.",
  "compliance-issue":
    "Analyse les problèmes de conformité et propose des actions correctives.",
};

export async function POST(request: Request) {
  try {
    const { anomalyType, context, severity } = await request.json();

    const baseInstruction =
      anomalyPrompts[anomalyType as keyof typeof anomalyPrompts] ||
      "Analyse cette anomalie et propose un plan d'action priorisé.";

    const prompt = `RAPPORT D'ANOMALIE - SÉVÉRITÉ: ${String(
      severity,
    ).toUpperCase()}

${baseInstruction}

CONTEXTE (JSON tronqué):
${JSON.stringify(context ?? {}, null, 2).slice(0, 4000)}

Rédige un rapport structuré en français, en markdown lisible, avec les sections suivantes :
1. Description de l'anomalie
2. Impact estimé (financier, opérationnel, client)
3. Actions correctives prioritaires (liste à puces avec niveaux de priorité)
4. Responsable(s) à alerter
5. Délai de résolution recommandé et indicateurs de suivi.`;

    const { text } = await generateText({
      model: sonarReasoning,
      prompt,
      temperature: 0.4,
      maxTokens: 900,
    });

    const cleaned = (text ?? "").replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    return Response.json({
      success: true,
      report: cleaned,
      timestamp: new Date().toISOString(),
      anomalyType,
      severity,
    });
  } catch (error) {
    console.error("[v0] Error generating anomaly report:", error);
    return Response.json(
      { success: false, error: "Erreur lors de la génération du rapport" },
      { status: 500 },
    );
  }
}
