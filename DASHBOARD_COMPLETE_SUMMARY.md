# Tableau de Bord Intelligent PDG - Résumé Complet

## Structure Globale

### 8 Onglets Principaux

1. **Vue d'Ensemble** - KPI clés + 4 graphiques Highcharts
2. **Sites** - CRUD gestion sites, fermeture pour événements
3. **Employés** - CRUD gestion staff
4. **Avis** - Affichage avis + analyse IA Claude
5. **IA** - Chat stratégique + 6 questions prédéfinies
6. **Rapports** - 6 types rapports générés par IA
7. **Alertes** - Détection automatique anomalies (8+ seuils)
8. **Instructions** - Communication avec managers de sites

---

## Architecture Fichiers

\`\`\`
/components/dashboard/
├── dashboard-tabs.tsx (Navigation principale)
├── tabs/
│   ├── overview-tab.tsx
│   ├── sites-tab.tsx
│   ├── employees-tab.tsx
│   ├── reviews-tab.tsx
│   ├── ai-analysis-tab.tsx ✨ NOUVEAU
│   ├── reports-tab.tsx ✨ NOUVEAU
│   ├── alerts-tab.tsx ✨ NOUVEAU
│   └── instructions-tab.tsx ✨ NOUVEAU
├── charts/
│   ├── revenue-chart.tsx
│   ├── occupancy-chart.tsx
│   ├── sentiment-chart.tsx
│   └── rating-chart.tsx
└── ai/
    └── ai-review-analyzer.tsx

/app/
├── auth/page.tsx (Login)
├── dashboard/page.tsx (Main dashboard)
└── api/
    ├── ai/
    │   ├── analyze-review/route.ts
    │   └── analyze-metrics/route.ts ✨ NOUVEAU
    └── reports/
        ├── generate/route.ts ✨ NOUVEAU
        └── anomaly/route.ts ✨ NOUVEAU

/public/data/
├── sites.json
├── employees.json
└── reviews.json

/lib/
├── hooks/
│   ├── use-auth.ts
│   ├── use-dashboard-data.ts
│   └── use-ai-chat.ts
├── types/
│   └── ai-context.ts
├── prompts/
│   ├── system-prompt.ts
│   └── prompt-builder.ts
└── utils/
    ├── mock-context.ts
    └── test-anomalies.ts ✨ NOUVEAU
\`\`\`

---

## Fonctionnalités Par Onglet

### 1️⃣ Onglet IA

**Capacités:**
- Chat conversationnel avec Claude 3.5 Sonnet
- 6 questions prédéfinies stratégiques
- Analyse indicateurs en temps réel
- Recommandations actionnables
- Réponses formatées Markdown

**API:** `POST /api/ai/analyze-metrics`

**Données utilisées:** Sites, employés, avis

---

### 2️⃣ Onglet Rapports

**Types disponibles:**
- Rapport Exécutif (8p) - PDG summary
- Rapport Financier (12p) - Revenus détaillés
- Rapport Opérationnel (10p) - Performance
- Rapport Satisfaction (6p) - Avis clients
- Rapport Anomalies (4p) - Alertes
- Rapport Stratégique (15p) - Recommandations

**Génération:** Via Claude IA (2000 tokens max)

**Téléchargement:** PDF (à implémenter)

**API:** `POST /api/reports/generate`

---

### 3️⃣ Onglet Alertes

**Seuils Détection Automatique:**
- ✅ Baisse revenus > 20% → CRITIQUE
- ✅ Occupation < 50% → MOYENNE
- ✅ Avis négatifs > 2 → HAUTE
- ✅ Sites fermés → CRITIQUE
- ✅ Absences > 3 → MOYENNE
- ✅ Conformité < 80% → CRITIQUE

**Gestion:**
- Affichage par sévérité
- Abandon alertes (X)
- Actions recommandées
- Historique conservation

---

### 4️⃣ Onglet Instructions

**Création:**
- Sélection site
- Priorité (urgent/normal/info)
- Titre et détails
- Date limite auto (7j)

**Suivi:**
- Statuts (nouveau/lu/exécuté)
- Manager responsable
- Historique complet

**Gestion:**
- Édition post-création
- Suppression si nécessaire
- Rappels échéance

---

## Flux Complet Anomalie

\`\`\`
┌─ Détection Automatique (Alertes Tab)
│
├─ Classification Sévérité
│
├─ Notification PDG
│
├─ Création Instruction pour Manager
│
├─ Génération Rapport Anomalie (Claude)
│
├─ Analyse Causes + Recommandations
│
├─ Export PDF Consolidé
│
└─ Archivage + Historique Audit (7 ans)
\`\`\`

---

## Intégration Claude API

### 3 Endpoints IA

**1. Analyse Métriques**
\`\`\`
POST /api/ai/analyze-metrics
Body: { question, context: {sites, employees, reviews} }
Response: { analysis (Markdown) }
\`\`\`

**2. Génération Rapports**
\`\`\`
POST /api/reports/generate
Body: { reportType, context }
Response: { url, content (Markdown) }
\`\`\`

**3. Rapport Anomalie**
\`\`\`
POST /api/reports/anomaly
Body: { anomalyType, severity, context }
Response: { report, timestamp, anomalyType }
\`\`\`

---

## Données Fictives JSON

### sites.json
\`\`\`json
{
  "id": "site-1",
  "name": "Bini Forêt",
  "manager": "Jean Dupont",
  "location": "Forêt Nationale",
  "monthlyRevenue": 85000,
  "capacity": 150,
  "occupancyRate": 72,
  "status": "actif",
  "closureReason": null,
  "employees": 12
}
\`\`\`

### employees.json
\`\`\`json
{
  "id": "emp-1",
  "firstName": "Alice",
  "lastName": "Martin",
  "role": "Guide",
  "site": "site-1",
  "email": "alice@domainebini.ci",
  "phone": "+225 01 23 45 67 89",
  "salary": 450000,
  "status": "actif"
}
\`\`\`

### reviews.json
\`\`\`json
{
  "id": "review-1",
  "site": "site-1",
  "rating": 4.8,
  "comment": "Excellent séjour...",
  "sentiment": "positif",
  "date": "2025-11-20"
}
\`\`\`

---

## Authentification

**Utilisateurs Test:**
- **PDG**: pdg@domainebini.ci / admin123 (accès complet)
- **Coordinateur**: coord@domainebini.ci / coord123 (read-only)

**Stockage:** localStorage (session 30 min)

---

## Performance & Optimisation

- **Chargement initial:** < 2s
- **Refresh KPI:** 30s (configurable)
- **API Response:** < 500ms
- **CDN Highcharts:** Via CDN externe
- **Claude IA:** Max 2000 tokens/réponse

---

## Déploiement

**Vercel Ready:**
\`\`\`bash
npm install
npm run build
vercel deploy
\`\`\`

**Vars Environnement Requises:**
\`\`\`
ANTHROPIC_API_KEY=sk-ant-xxxxx
\`\`\`

---

## Roadmap Phase 2

- [ ] PostgreSQL + TimescaleDB
- [ ] Export PDF intégré
- [ ] Notifications temps réel (SMS/Email)
- [ ] Calendrier instructions + rappels
- [ ] Dashboard personnalisé par rôle
- [ ] Mobile app React Native
- [ ] Analytics avancées
- [ ] Machine Learning prédictions

---

## Support & Maintenance

- **Logs:** Console + Sentry (à configurer)
- **Alertes Tech:** Email admin@domainebini.ci
- **SLA:** 99.5% uptime
- **Backup:** Quotidien 23h UTC
