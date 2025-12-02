import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const perplexity = createOpenAICompatible({
  name: "perplexity",
  apiKey: process.env.PPLX_API_KEY!,
  baseURL: "https://api.perplexity.ai",
});

// Choisis un modèle Perplexity valide, par ex. "sonar-reasoning"
const sonarReasoning = perplexity("sonar-reasoning");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      review,
      title,
      rating,
      siteName,
      batchAnalysis,
      reviews,
      filterSite,
    } = body;

    if (batchAnalysis && reviews && reviews.length > 0) {
      return handleBatchAnalysis(reviews, filterSite);
    } else if (review && title && rating && siteName) {
      return handleSingleReview(review, title, rating, siteName);
    } else {
      return Response.json(
        { error: "Données manquantes pour l'analyse" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Review analysis error:", error);
    return Response.json(
      {
        summary: "Erreur lors de l'analyse",
        sentiment_score: 0,
        key_issues: [],
        recommended_actions: [],
        priority: "medium",
      },
      { status: 200 }
    );
  }
}

async function handleSingleReview(
  review: string,
  title: string,
  rating: number,
  siteName: string
) {
  const prompt = `Tu es un expert en analyse d’avis clients pour des sites écotouristiques.

Ta mission :
- Analyser précisément l’avis suivant.
- Identifier les sentiments, forces, faiblesses et actions prioritaires.
- Répondre UNIQUEMENT avec un JSON valide, sans introduction, sans explication, sans balises "<think>", sans markdown, sans texte en dehors de l’objet JSON.
- La réponse doit être exclusivement en français.

Données :
Site : {{siteName}}
Note : {{rating}}/5
Titre : {{title}}
Avis : {{review}}

Réponds uniquement avec un JSON strictement conforme à cette structure :

{
  "summary": "Résumé court et clair en français",
  "sentiment_score": "nombre entre -1 et 1",
  "sentiment_label": "positif | neutre | negatif",
  "key_issues": ["problème1", "problème2"],
  "strengths": ["point fort1", "point fort2"],
  "recommended_actions": ["action1", "action2"],
  "priority": "high | medium | low"
}`;

  try {
    const { text } = await generateText({
      model: sonarReasoning,
      prompt,
      temperature: 0.7,
      maxTokens: 1000, // Perplexity suit le schéma OpenAI (max_tokens)
    });

    const cleanedText = text
      .replace(/<think>[\s\S]*?<\/think>/g, "") // Supprimer les balises <think>
      .replace(/```[\s\S]*?```/g, "") // Supprimer les blocs de code markdown
      .trim();

    const analysis = JSON.parse(cleanedText);

    return Response.json({
      ...analysis,
      analysisType: "single",
      analyzedReview: { title, rating, siteName },
    });
  } catch (error) {
    console.error("Single review analysis error:", error);
    throw error;
  }
}

async function handleBatchAnalysis(
  reviews: Array<{
    comment: string;
    title: string;
    rating: number;
    siteName: string;
  }>,
  filterSite: string
) {
  const reviewsSummary = reviews
    .map(
      (r, i) =>
        `Avis ${i + 1}: ${r.siteName} | Note: ${r.rating}/5 | "${
          r.title
        }" - ${r.comment.substring(0, 100)}...`
    )
    .join("\n");

  const prompt = `Tu es un expert en analyse d’avis clients pour des sites écotouristiques.

Ta mission :
- Analyser un ensemble d’avis.
- Déterminer les tendances générales.
- Identifier forces, faiblesses, thèmes récurrents et actions prioritaires.
- Répondre UNIQUEMENT avec un JSON valide, sans introduction, sans explication, sans balises "<think>", sans markdown.
- La réponse doit être exclusivement en français.

Filtre : {{filterSite}}
Nombre total d’avis : {{reviews.length}}

Liste des avis :
{{reviewsSummary}}

Réponds uniquement avec un JSON strictement conforme à cette structure :

{
  "overall_sentiment": "positif" | "mixte" | "negatif",
  "average_rating": "nombre",
  "sentiment_distribution": {
    "positive": "pourcentage",
    "neutral": "pourcentage",
    "negative": "pourcentage"
  },
  "key_issues": ["problème1", "problème2", "problème3"],
  "strengths": ["force1", "force2", "force3"],
  "recurring_themes": {
    "positives": ["thème1", "thème2"],
    "negatives": ["thème1", "thème2"]
  },
  "priority_actions": ["action1", "action2"],
  "summary": "Résumé clair et concis de la tendance générale"
}`;

  try {
    const { text } = await generateText({
      model: sonarReasoning,
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    });

    const cleanedText = text
      .replace(/<think>[\s\S]*?<\/think>/g, "") // Supprimer les balises <think>
      .replace(/```[\s\S]*?```/g, "") // Supprimer les blocs de code markdown
      .trim();
    const analysis = JSON.parse(cleanedText);

    return Response.json({
      ...analysis,
      analysisType: "batch",
      reviewsCount: reviews.length,
      filterSite,
    });
  } catch (error) {
    console.error("Batch analysis error:", error);
    throw error;
  }
}
