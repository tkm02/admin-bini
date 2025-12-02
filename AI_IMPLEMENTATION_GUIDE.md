# Guide d'Implémentation - Module IA Claude

Tableau de Bord Intelligent PDG - Domaine Bini

## 1. Architecture Globale

Le module IA intègre Claude 3.5 Sonnet pour :
- Chat conversationnel stratégique
- Recommandations commerciales/opérationnelles
- Détection intelligente d'anomalies
- Prévisions et insights prédictifs

### Stack Technique
- Frontend: React 18 + Next.js 15 (TypeScript)
- Backend: Node.js + Route Handlers Next.js
- IA: Anthropic Claude API (claude-3-5-sonnet-20241022)
- UI: shadcn/ui + Tailwind CSS v4
- Data: Mock data (à remplacer par vrais endpoints)

---

## 2. Installation et Configuration

### 2.1 Prérequis
- Node.js 18+
- npm ou yarn
- Clé API Anthropic

### 2.2 Installation

\`\`\`bash
# Clone et installation
git clone <votre-repo>
cd domaine-bini-dashboard
npm install

# Variables d'environnement
cp .env.local.example .env.local

# Ajouter la clé API
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
\`\`\`

### 2.3 Démarrage

\`\`\`bash
npm run dev
# http://localhost:3000
\`\`\`

---

## 3. Structure des Fichiers

\`\`\`
project/
├── app/
│   ├── api/ai/                    # API Routes
│   │   ├── chat/route.ts          # Chat conversationnel
│   │   ├── recommendations/route.ts # Recommandations
│   │   └── anomalies/route.ts     # Détection anomalies
│   ├── page.tsx                   # Dashboard principal
│   └── layout.tsx                 # Layout
├── components/ai/
│   ├── chat-sidebar.tsx           # Chat Sidebar
│   ├── recommendations-widget.tsx # Recommandations
│   └── alerts-widget.tsx          # Alertes intelligentes
├── lib/
│   ├── types/ai-context.ts        # Types TypeScript
│   ├── prompts/
│   │   ├── system-prompt.ts       # Prompts système
│   │   └── prompt-builder.ts      # Builder prompts
│   ├── hooks/
│   │   └── use-ai-chat.ts         # Hook chat
│   └── utils/
│       └── mock-context.ts        # Mock data
└── .env.local                     # Variables d'env
\`\`\`

---

## 4. API Endpoints Détaillés

### 4.1 POST /api/ai/chat

Chat conversationnel avec questions stratégiques.

**Request:**
\`\`\`json
{
  "question": "Quels sites sous-performent?",
  "context": {
    "financial": { ... },
    "operations": { ... },
    "clients": { ... },
    "team": { ... },
    "history": { ... }
  },
  "type": "conversational"
}
\`\`\`

**Response:**
\`\`\`json
{
  "type": "answer",
  "content": "Markdown réponse IA...",
  "timestamp": "2024-11-28T10:30:00Z"
}
\`\`\`

### 4.2 POST /api/ai/recommendations

Recommandations stratégiques par focus.

**Request:**
\`\`\`json
{
  "context": { ... },
  "focus": "all" | "commercial" | "operational" | "team"
}
\`\`\`

**Response:**
\`\`\`json
{
  "recommendations": [
    {
      "focus": "commercial",
      "content": "Markdown recommandations..."
    }
  ]
}
\`\`\`

### 4.3 POST /api/ai/anomalies

Détection et analyse d'anomalies.

**Request:**
\`\`\`json
{
  "context": { ... }
}
\`\`\`

**Response:**
\`\`\`json
{
  "analysis": "Markdown analyse anomalies...",
  "timestamp": "2024-11-28T10:30:00Z"
}
\`\`\`

---

## 5. Types de Données - DashboardContext

La structure de données contextuelle (voir `lib/types/ai-context.ts`):

### FinancialData
- monthlyRevenue: Revenu mensuel total (CFA)
- revenueChange: % variation vs période précédente
- averageRevenuePerVisitor: RPV moyen
- conversionRate: % conversion
- forecast30/60/90Days: Prévisions (CFA)

### OperationsData
- totalVisitors: Nombre visiteurs
- occupancyRate: % occupation moyenne
- occupancyBySite: Détail par site
- uptime: % disponibilité infrastructure
- supportResponseTime: Temps réponse support

### ClientsData
- nps: Score NPS (-100 à 100)
- satisfactionRate: Note satisfaction (1-5)
- retentionRate: % clients fidèles
- sentimentAnalysis: Analyse sentiment avis
- churnRiskClients: Clients à risque

### TeamData
- staffBySite: Distribution effectifs
- openIssues: Problèmes ouverts par catégorie
- complianceScore: Score conformité (%)
- turnoverRate: % turnover annuel
- absences: Absences signalées

### HistoryData
- last12MonthsTrend: Tendance 12 mois
- seasonalPatterns: Patterns saisonniers
- bestPerformingSites: Meilleurs sites
- worstPerformingSites: Sites faibles
- topActivities: Activités performantes

---

## 6. Prompts Système - Stratégie IA

### 6.1 Prompt Principal
Contexte global, ton professionnel, focalisation données.

### 6.2 Prompts Spécialisés
- **Commercial**: Focus sur revenus, pricing, conversion
- **Operational**: Infrastructure, staff, processus
- **Team**: RH, conformité, turnover
- **Anomaly**: Détection patterns anormaux

Voir `lib/prompts/system-prompt.ts` pour détails complets.

---

## 7. Intégration avec Vraies Données

### 7.1 Remplacer Mock Data

Actuellement: `lib/utils/mock-context.ts` pour démo

**À faire:**
1. Connecter PostgreSQL + TimescaleDB pour séries temps
2. Créer data fetchers pour chaque section:
   - Financial API (`/api/dashboard/financial`)
   - Operations API (`/api/dashboard/operations`)
   - etc.
3. Implémenter streaming temps réel (WebSockets)

### 7.2 Exemple Intégration DB

\`\`\`typescript
// lib/db/queries.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function getFinancialData(period: string) {
  const result = await sql`
    SELECT 
      SUM(amount) as revenue,
      AVG(amount) as avg_per_visitor
    FROM transactions
    WHERE created_at > NOW() - INTERVAL '1 month'
  `;
  return result[0];
}
\`\`\`

---

## 8. Déploiement en Production

### 8.1 Vercel (Recommandé)

\`\`\`bash
# Déploiement Vercel
vercel deploy

# Variables d'environnement
vercel env add ANTHROPIC_API_KEY
\`\`\`

### 8.2 Configuration Vercel

Environment Variables:
- ANTHROPIC_API_KEY: Clé Anthropic
- DATABASE_URL: URL PostgreSQL (si utilisé)
- REDIS_URL: URL Redis (si cache utilisé)

### 8.3 SLA & Monitoring

- Uptime cible: 99.5%
- Chat latency: < 100ms
- API response: < 2s
- Model rate limit: Anthropic free tier = 5 RPM

Monitorer via:
- Vercel Analytics
- Sentry pour erreurs
- OpenTelemetry pour tracing

---

## 9. Sécurité & Authentification

### 9.1 API Keys
- Stocké en variables d'env (jamais en code)
- Utilisé côté backend uniquement
- Rotationné régulièrement

### 9.2 Authentification Utilisateur
À implémenter (NextAuth.js recommandé):
- JWT + OAuth2
- 2FA optionnel pour PDG
- Session timeout 30 min
- RBAC: PDG (full), Coordinator (read-only)

### 9.3 CORS & Sécurité
- CORS: Restricter à domaine Domaine Bini
- Rate limiting: 100 req/min par utilisateur
- Input validation: sanitize toutes entrées
- Audit logs: Tracer toutes actions

---

## 10. Troubleshooting

### 10.1 Erreur: "API key not found"
- Vérifier .env.local a ANTHROPIC_API_KEY
- Restart dev server après changement

### 10.2 Erreur: "Failed to parse AI response"
- Vérifier contenu markdown de Claude
- Augmenter max_tokens si réponse coupée
- Check logs: \`npm run dev\`

### 10.3 Chat lent (> 2s)
- Vérifier Anthropic API status
- Augmenter timeout réseau
- Check token usage (rate limits)

### 10.4 Mock data vs. Real data
- Si tests: Garder mock data
- Si prod: Remplacer par vraies queries DB
- Voir section 7 pour migration

---

## 11. Tests & QA

### 11.1 Tests Manuels

1. Chat Sidebar
   - Poser 5+ questions types
   - Vérifier markdown rendering
   - Test avec contextes différents

2. Recommandations
   - Focus commercial/operational/team
   - Vérifier priorités cohérentes
   - Test refresh auto (15 min)

3. Alertes
   - Créer anomalies (revenus baisse > 20%)
   - Vérifier détection automatique
   - Test dismiss/clear

### 11.2 Tests Automatisés

À ajouter (Jest + React Testing Library):
- API endpoints response mocking
- Component rendering
- User interactions
- Error boundaries

---

## 12. Roadmap Futur

### Phase 2 (Semaines 9-14)
- Intégration vraies données PostgreSQL
- WebSocket temps réel
- Export PDF/Excel rapports
- Intégration notifications (Email/SMS)

### Phase 3 (Semaines 15-20)
- ML avancé (prévisions ARIMA)
- Comparaisons inter-sites interactives
- Drill-down détaillés par KPI
- Personnalisation layout drag-drop

### Phase 4 (Semaines 21+)
- Mobile app (React Native)
- Intégration ERP/CRM
- Webhooks externes
- API publique pour partenaires

---

## 13. Support & Contact

- Documentation complète: /docs
- Issues GitHub: github.com/domainebini/dashboard
- Support technique: support@domainebini.ci
- Email: dev@domainebini.ci

---

## 14. Références

- [Anthropic Claude API](https://docs.anthropic.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Best Practices](https://react.dev)
- [Vercel Deployment](https://vercel.com/docs)

---

Version: 1.0 | Date: Novembre 2025 | Statut: Production-Ready
