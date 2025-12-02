# Nouveaux Onglets et Fonctionnalités du Dashboard

## 1. Onglet IA (Analyse et Interprétation)

### Fonctionnalités
- **Chat conversationnel IA**: Posez des questions stratégiques à Claude
- **6 Questions prédéfinies** pour une analyse rapide:
  - "Quel site sous-performe le plus et pourquoi?"
  - "Comment augmenter les revenus de 20% en 3 mois?"
  - "Quels sont les problèmes majeurs identifiés?"
  - "Recommande une stratégie pour améliorer le NPS"
  - "Analyse la satisfaction des clients par site"
  - "Quels employés montrent des signes de churn?"

### Usage
1. Cliquez sur l'onglet IA
2. Posez votre question ou cliquez sur une suggestion
3. Recevez une analyse détaillée avec recommandations
4. Réponses en Markdown formaté

---

## 2. Onglet Rapports (Génération à la demande)

### Types de Rapports
- **Rapport Exécutif** (8 pages): Synthèse KPI pour le PDG
- **Rapport Financier** (12 pages): Analyse revenus détaillée
- **Rapport Opérationnel** (10 pages): Performance sites et équipes
- **Rapport Satisfaction** (6 pages): Avis clients et NPS
- **Rapport Anomalies** (4 pages): Alertes et incidents
- **Rapport Stratégique** (15 pages): Recommandations 30/60/90 jours

### Usage
1. Cliquez sur "Générer" pour le rapport désiré
2. Le système génère le rapport via Claude IA
3. Consultez les rapports récents
4. Téléchargez en PDF (bouton disponible)

### Génération Automatique
Les rapports d'anomalies se génèrent automatiquement quand:
- Baisse de revenus > 20%
- Taux d'occupation < 50%
- Plus de 2 avis négatifs détectés
- Site fermé pour événement spécial
- Plus de 3 employés en congé
- Score conformité < 80%

---

## 3. Onglet Alertes (Système de Détection)

### Sévérités
- 🔴 **CRITIQUE**: Impacts majeurs immédiat (revenus, fermeture, incidents)
- 🟠 **HAUTE**: Impacts significatifs (baisse 10-20%, NPS, staff)
- 🟡 **MOYENNE**: Impacts modérés (occupation, formations)
- 🔵 **INFO**: Informations et suggestions

### Alertes Générées Automatiquement
- Baisse de revenus moyens détectée
- Sites sous-utilisés (occupation < 50%)
- Avis clients négatifs récurrents
- Sites fermés pour événements spéciaux
- Absences employés importantes
- Problèmes de conformité

### Actions
- Marquez les alertes comme traitées (X)
- Chaque alerte propose une action recommandée
- Tableau de bord synthétique des alertes par sévérité

---

## 4. Onglet Instructions (Communication Managers)

### Créer une Instruction
1. Cliquez "Créer une Instruction"
2. Sélectionnez le site et son manager
3. Entrez le titre et les détails
4. Sélectionnez la priorité
5. Envoyez

### Priorités
- 🔴 **URGENT**: Traitement immédiat
- 🟡 **NORMAL**: Traitement dans 24-48h
- 🔵 **INFO**: Traitement administratif

### Statuts
- **NOUVEAU**: Instruction créée, pas encore vue
- **LU**: Manager a vu l'instruction
- **EXÉCUTÉ**: Tâche complétée

### Gestion
- Modifiez les instructions existantes
- Supprimez si nécessaire
- Date limite par défaut: 7 jours
- Historique complet de l'exécution

---

## 5. Intégration IA et Génération de Rapports

### Endpoints API

#### POST /api/ai/analyze-metrics
\`\`\`json
{
  "question": "Quel site sous-performe?",
  "context": {
    "sites": [...],
    "employees": [...],
    "reviews": [...]
  }
}
\`\`\`

#### POST /api/reports/generate
\`\`\`json
{
  "reportType": "executive|financial|operational|satisfaction|anomalies|strategic",
  "context": {...}
}
\`\`\`

#### POST /api/reports/anomaly
\`\`\`json
{
  "anomalyType": "revenue-drop|low-occupancy|negative-sentiment|staff-absence|site-closure|compliance-issue",
  "severity": "critical|high|medium|low",
  "context": {...}
}
\`\`\`

---

## 6. Flux Complet d'Anomalie

\`\`\`
1. Détection Automatique (Alertes Tab)
   ↓
2. Alerter le PDG (Widget + Badge)
   ↓
3. PDG Crée Instruction pour Manager
   ↓
4. Générer Rapport Automatique d'Anomalie
   ↓
5. IA Analyse et Propose Actions
   ↓
6. Exporter Rapport Consolidé
\`\`\`

---

## 7. Données Utilisées

Tous les onglets utilisent les données JSON centralisées:
- `/public/data/sites.json`
- `/public/data/employees.json`
- `/public/data/reviews.json`

Remplacez ces fichiers pour utiliser des données réelles depuis PostgreSQL.

---

## 8. Modèle de Données

### Alert
\`\`\`typescript
{
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  site?: string
  timestamp: Date
  action?: string
}
\`\`\`

### Instruction
\`\`\`typescript
{
  id: string
  siteId: string
  siteName: string
  manager: string
  title: string
  content: string
  priority: "urgent" | "normal" | "info"
  status: "nouveau" | "lu" | "exécuté"
  createdAt: Date
  dueDate?: Date
  createdBy: string
}
\`\`\`

---

## 9. Configuration Requise

- ANTHROPIC_API_KEY dans `.env.local`
- Versions minimales:
  - React 18+
  - Next.js 15+
  - TypeScript 5+

---

## 10. Cas d'Usage

### PDG Matin
1. Consulte **Alertes Tab** pour anomalies critiques
2. Va sur **IA Tab** pour analyser causes
3. Crée **Instructions** pour managers concernés
4. Génère **Rapport Exécutif** pour gouvernance

### Manager Réception Instruction
1. Voit notification nouvelle instruction
2. Consulte détails et deadlines
3. Exécute l'instruction
4. Signale achèvement

### Audit Mensuel
1. Génère **Rapport Financier** complet
2. Exporte **Rapport Opérationnel**
3. Consulte **Rapport Satisfaction**
4. Archive dans système de gestion documentaire

---

## 11. Prochaines Améliorations

- Export PDF intégré des rapports
- Notifications en temps réel pour alertes critiques
- Historique complet d'audit
- Calendrier échéances instructions
- Dashboard personnalisé par rôle
- Intégration SMS/Email alertes
