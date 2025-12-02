// Utilitaire pour tester la détection d'anomalies
export const simulateAnomalies = () => {
  const anomalies = [
    {
      type: "revenue-drop",
      description: "Baisse de revenus > 20%",
      sites: ["Bini Forêt"],
      impact: "CRITIQUE",
    },
    {
      type: "low-occupancy",
      description: "Occupation < 50%",
      sites: ["Bini Lagune", "Bini Montagne"],
      impact: "HAUTE",
    },
    {
      type: "negative-sentiment",
      description: "Plus de 2 avis négatifs en 3 jours",
      sites: ["Bini Plage"],
      impact: "HAUTE",
    },
    {
      type: "staff-absence",
      description: "Plus de 3 employés en congé",
      sites: ["Bini Forêt", "Bini Lagune"],
      impact: "MOYENNE",
    },
  ]

  return anomalies
}

export const generateAnomalyReport = async (anomalyType: string, severity: string, context: any) => {
  const response = await fetch("/api/reports/anomaly", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      anomalyType,
      severity,
      context,
    }),
  })

  return await response.json()
}
