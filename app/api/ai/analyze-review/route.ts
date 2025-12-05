import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const perplexity = createOpenAICompatible({
  name: "perplexity",
  apiKey: process.env.PPLX_API_KEY!,
  baseURL: "https://api.perplexity.ai",
});

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

    console.log("📥 Données reçues:", { 
      review, 
      title, 
      rating, 
      siteName, 
      batchAnalysis 
    });

    // ✅ Batch analysis
    if (batchAnalysis && Array.isArray(reviews) && reviews.length > 0) {
      return handleBatchAnalysis(reviews, filterSite);
    } 
    
    // ✅ Single review - title peut être vide
    else if (
      review && 
      typeof title === 'string' &&  // ✅ Accepter chaîne vide
      typeof rating === 'number' && 
      siteName
    ) {
      return handleSingleReview(review, title, rating, siteName);
    } 
    
    // ❌ Données manquantes
    else {
      console.error("❌ Validation échouée:", { review, title, rating, siteName });
      return Response.json(
        { 
          error: "Données manquantes pour l'analyse",
          received: { 
            hasReview: !!review, 
            titleType: typeof title,
            hasRating: typeof rating === 'number', 
            hasSiteName: !!siteName 
          }
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("❌ Review analysis error:", error);
    return Response.json(
      {
        error: error.message || "Erreur lors de l'analyse",
        summary: "Erreur lors de l'analyse",
        sentiment_score: 0,
        key_issues: [],
        recommended_actions: [],
        priority: "medium",
      },
      { status: 500 }
    );
  }
}

async function handleSingleReview(
  review: string,
  title: string,
  rating: number,
  siteName: string
) {
  // ✅ Gérer le cas où title est vide
  const reviewTitle = title || "Avis sans titre";

  const prompt = `Tu es un expert en analyse d'avis clients pour des sites écotouristiques.

Ta mission :
- Analyser précisément l'avis suivant.
- Identifier les sentiments, forces, faiblesses et actions prioritaires.
- Répondre UNIQUEMENT avec un JSON valide, sans introduction, sans explication, sans balises "<think>", sans markdown, sans texte en dehors de l'objet JSON.
- La réponse doit être exclusivement en français.

Données :
Site : ${siteName}
Note : ${rating}/5
Titre : ${reviewTitle}
Avis : ${review}

Réponds uniquement avec un JSON strictement conforme à cette structure :

{
  "summary": "Résumé court et clair en français",
  "sentiment_score": 0.5,
  "sentiment_label": "positif",
  "key_issues": ["problème1", "problème2"],
  "strengths": ["point fort1", "point fort2"],
  "recommended_actions": ["action1", "action2"],
  "priority": "medium"
}`;

  try {
    console.log("🤖 Envoi de la requête à Perplexity...");

    const { text } = await generateText({
      model: sonarReasoning,
      prompt,
      temperature: 0.7,
      maxTokens: 800,
    });

    console.log("📤 Réponse brute:", text);

    // Nettoyer la réponse
    let cleanedText = text
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Extraire le JSON si entouré de texte
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    console.log("🧹 Texte nettoyé:", cleanedText);

    const analysis = JSON.parse(cleanedText);

    return Response.json({
      ...analysis,
      analysisType: "single",
      analyzedReview: { 
        title: reviewTitle, 
        rating, 
        siteName 
      },
    });
  } catch (error: any) {
    console.error("❌ Single review analysis error:", error);
    
    // Fallback en cas d'erreur de parsing
    return Response.json({
      summary: `Analyse de l'avis "${reviewTitle}" pour ${siteName} (note: ${rating}/5)`,
      sentiment_score: rating >= 4 ? 0.8 : rating >= 3 ? 0.5 : 0.2,
      sentiment_label: rating >= 4 ? "positif" : rating >= 3 ? "neutre" : "negatif",
      key_issues: rating <= 2 ? ["Expérience insatisfaisante"] : [],
      strengths: rating >= 4 ? ["Bonne expérience globale"] : [],
      recommended_actions: ["Analyser manuellement cet avis"],
      priority: rating <= 2 ? "high" : rating === 3 ? "medium" : "low",
      analysisType: "single",
      analyzedReview: { 
        title: reviewTitle, 
        rating, 
        siteName 
      },
      error: "Erreur lors du parsing de la réponse IA",
    });
  }
}


// async function handleSingleReview(
//   review: string,
//   title: string,
//   rating: number,
//   siteName: string
// ) {
//   // ✅ Utiliser des template literals pour remplacer les variables
//   const prompt = `Tu es un expert en analyse d'avis clients pour des sites écotouristiques.

// Ta mission :
// - Analyser précisément l'avis suivant.
// - Identifier les sentiments, forces, faiblesses et actions prioritaires.
// - Répondre UNIQUEMENT avec un JSON valide, sans introduction, sans explication, sans balises "<think>", sans markdown, sans texte en dehors de l'objet JSON.
// - La réponse doit être exclusivement en français.

// Données :
// Site : ${siteName}
// Note : ${rating}/5
// Titre : ${title}
// Avis : ${review}

// Réponds uniquement avec un JSON strictement conforme à cette structure :

// {
//   "summary": "Résumé court et clair en français",
//   "sentiment_score": 0.5,
//   "sentiment_label": "positif",
//   "key_issues": ["problème1", "problème2"],
//   "strengths": ["point fort1", "point fort2"],
//   "recommended_actions": ["action1", "action2"],
//   "priority": "medium"
// }`;

//   try {
//     console.log("🤖 Envoi de la requête à Perplexity...");

//     const { text } = await generateText({
//       model: sonarReasoning,
//       prompt,
//       temperature: 0.7,
//       maxTokens: 800,
//     });

//     console.log("📤 Réponse brute:", text);

//     // Nettoyer la réponse
//     let cleanedText = text
//       .replace(/<think>[\s\S]*?<\/think>/g, "")
//       .replace(/```[\s\S]*?```/g, "")
//       .replace(/```\s*/g, "")
//       .trim();

//     // Extraire le JSON si entouré de texte
//     const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       cleanedText = jsonMatch[0];
//     }

//     console.log("🧹 Texte nettoyé:", cleanedText);

//     const analysis = JSON.parse(cleanedText);

//     return Response.json({
//       ...analysis,
//       analysisType: "single",
//       analyzedReview: { title, rating, siteName },
//     });
//   } catch (error: any) {
//     console.error("❌ Single review analysis error:", error);
    
//     // Fallback en cas d'erreur de parsing
//     return Response.json({
//       summary: `Analyse de l'avis "${title}" pour ${siteName} (note: ${rating}/5)`,
//       sentiment_score: rating >= 4 ? 0.8 : rating >= 3 ? 0.5 : 0.2,
//       sentiment_label: rating >= 4 ? "positif" : rating >= 3 ? "neutre" : "negatif",
//       key_issues: ["Analyse détaillée indisponible"],
//       strengths: rating >= 4 ? ["Bonne expérience globale"] : [],
//       recommended_actions: ["Analyser manuellement cet avis"],
//       priority: rating <= 2 ? "high" : "medium",
//       analysisType: "single",
//       analyzedReview: { title, rating, siteName },
//       error: "Erreur lors du parsing de la réponse IA",
//     });
//   }
// }

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
        `Avis ${i + 1}: ${r.siteName} | Note: ${r.rating}/5 | "${r.title}" - ${r.comment.substring(0, 100)}...`
    )
    .join("\n");

  // ✅ Utiliser des template literals
  const prompt = `Tu es un expert en analyse d'avis clients pour des sites écotouristiques.

Ta mission :
- Analyser un ensemble d'avis.
- Déterminer les tendances générales.
- Identifier forces, faiblesses, thèmes récurrents et actions prioritaires.
- Répondre UNIQUEMENT avec un JSON valide, sans introduction, sans explication, sans balises "<think>", sans markdown.
- La réponse doit être exclusivement en français.

Filtre : ${filterSite}
Nombre total d'avis : ${reviews.length}

Liste des avis :
${reviewsSummary}

Réponds uniquement avec un JSON strictement conforme à cette structure :

{
  "overall_sentiment": "positif",
  "average_rating": 4.2,
  "sentiment_distribution": {
    "positive": 60,
    "neutral": 25,
    "negative": 15
  },
  "key_issues": ["problème1", "problème2"],
  "strengths": ["force1", "force2"],
  "recurring_themes": {
    "positives": ["thème1", "thème2"],
    "negatives": ["thème1", "thème2"]
  },
  "priority_actions": ["action1", "action2"],
  "summary": "Résumé clair et concis"
}`;

  try {
    console.log("🤖 Envoi de l'analyse groupée à Perplexity...");

    const { text } = await generateText({
      model: sonarReasoning,
      prompt,
      temperature: 0.7,
      maxTokens: 800,
    });

    console.log("📤 Réponse brute batch:", text);

    // Nettoyer la réponse
    let cleanedText = text
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Extraire le JSON si entouré de texte
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    console.log("🧹 Texte nettoyé batch:", cleanedText);

    const analysis = JSON.parse(cleanedText);

    return Response.json({
      ...analysis,
      analysisType: "batch",
      reviewsCount: reviews.length,
      filterSite,
    });
  } catch (error: any) {
    console.error("❌ Batch analysis error:", error);
    
    // Fallback
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    return Response.json({
      overall_sentiment: avgRating >= 4 ? "positif" : avgRating >= 3 ? "mixte" : "negatif",
      average_rating: avgRating.toFixed(1),
      sentiment_distribution: {
        positive: Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100),
        neutral: Math.round((reviews.filter(r => r.rating === 3).length / reviews.length) * 100),
        negative: Math.round((reviews.filter(r => r.rating <= 2).length / reviews.length) * 100),
      },
      key_issues: ["Analyse détaillée indisponible"],
      strengths: ["Analyse des forces indisponible"],
      recurring_themes: {
        positives: ["À analyser manuellement"],
        negatives: ["À analyser manuellement"],
      },
      priority_actions: ["Revoir les avis manuellement"],
      summary: `${reviews.length} avis analysés pour ${filterSite}`,
      analysisType: "batch",
      reviewsCount: reviews.length,
      filterSite,
      error: "Erreur lors du parsing de la réponse IA",
    });
  }
}
