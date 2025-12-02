import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const perplexity = createOpenAICompatible({
  name: "perplexity",
  apiKey: process.env.PPLX_API_KEY!,
  baseURL: "https://api.perplexity.ai",
});

// Modèle Perplexity (raisonnement + recherche temps réel)
const sonarReasoning = perplexity("sonar-reasoning");

const REPORT_PROMPTS: Record<string, string> = {
  executive: `Tu es un data analyst senior qui rédige un **rapport exécutif pour un PDG** 
d'un groupe de sites écotouristiques en Afrique de l'Ouest.

Contexte (JSON tronqué) :
{{context}}

Rédige un rapport en **français**, format **Markdown**, avec :
- Un titre de rapport
- Une section "KPI clés" avec chiffres plausibles cohérents avec le contexte
- Une section "Tendances" (3–5 points)
- Une section "Recommandations" (2–4 actions stratégiques)`,
  financial: `Tu es un contrôleur financier qui prépare un **rapport financier détaillé** 
pour un groupe de sites écotouristiques.

Contexte (JSON tronqué) :
{{context}}

Rédige un rapport en **français**, format **Markdown**, avec :
- Tableau "Revenus par site" (site, revenus, % croissance)
- Section "Analyse de la rentabilité"
- Section "Prévisions 30/60/90 jours" (avec montants plausibles)
- Section "Opportunités & leviers de croissance"`,
  operational: `Tu es un directeur des opérations.

Contexte (JSON tronqué) :
{{context}}

Rédige un **rapport opérationnel** en français, Markdown, avec :
- Performance des sites (occupation, incidents, disponibilité des équipes)
- Liste des problèmes ouverts / risques
- Recommandations opérationnelles concrètes (maintenance, staffing, process)`,
  satisfaction: `Tu es responsable expérience client.

Contexte (JSON tronqué) :
{{context}}

Rédige un **rapport de satisfaction clients** en français, Markdown, avec :
- Métriques clés (NPS, satisfaction moyenne, % avis positifs/négatifs)
- Problèmes récurrents identifiés dans les avis
- Points forts les plus appréciés
- Plan d’actions prioritaire pour améliorer la satisfaction`,
  anomalies: `Tu es analyste risques.

Contexte (JSON tronqué) :
{{context}}

Rédige un **rapport d'anomalies & alertes** en français, Markdown, avec :
- Liste des alertes critiques (sites sous-performants, chutes de NPS, etc.)
- Incidents récents marquants
- Analyse des causes probables
- Actions correctives recommandées`,
  strategic: `Tu es consultant stratégique.

Contexte (JSON tronqué) :
{{context}}

Rédige un **plan stratégique 30/60/90 jours** en français, Markdown, avec :
- Objectifs globaux
- Plan d’actions pour 0–30 jours
- Plan d’actions pour 30–60 jours
- Plan d’actions pour 60–90 jours
- Indicateurs de succès à suivre`,
};

export async function POST(request: Request) {
  try {
    const { reportType, context } = await request.json();

    const type =
      (reportType as keyof typeof REPORT_PROMPTS) || ("executive" as const);
    const basePrompt = REPORT_PROMPTS[type] ?? REPORT_PROMPTS.executive;

    const contextSummary = JSON.stringify(context ?? {}).slice(0, 4000);

    const prompt = basePrompt.replace("{{context}}", contextSummary);

    const { text } = await generateText({
      model: sonarReasoning,
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    });

    const cleanedText = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    return Response.json({
      success: true,
      type,
      content: cleanedText,
      generatedAt: new Date().toISOString(),
      source: "perplexity",
    });
  } catch (error) {
    console.error("[v0] Error generating report:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de la génération du rapport",
      },
      { status: 500 },
    );
  }
}
