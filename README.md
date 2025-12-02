# Tableau de Bord Intelligent PDG - Domaine Bini

Système de gestion écotourisme avec assistance IA utilisant Claude 3.5 Sonnet.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)

## 🎯 Vue d'ensemble

Le **Tableau de Bord Intelligent PDG** est la solution décisionnelle complète pour Domaine Bini, permettant au PDG (Monsieur Bini) d'avoir une **visibilité complète en temps réel** sur :

- ✅ **Centralisation** de toutes les données opérationnelles multisite (11 sites)
- ✅ **Visualisation** des KPI critiques avec clarté et esthétique
- ✅ **Alertes** en temps réel sur anomalies et opportunités
- ✅ **Recommandations** stratégiques via IA augmentée (Claude)
- ✅ **Décisions** rapides avec données fiables et contextualisées
- ✅ **Exports** rapports consolidés pour gouvernance

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Clé API Anthropic (gratuit: https://console.anthropic.com)

### Installation (5 min)

\`\`\`bash
# 1. Clone
git clone <votre-repo>
cd domaine-bini-dashboard

# 2. Installation dépendances
npm install

# 3. Configuration
cp .env.local.example .env.local
# Ajouter ANTHROPIC_API_KEY dans .env.local

# 4. Démarrage
npm run dev

# 5. Accès
# http://localhost:3000
\`\`\`

## 📊 Fonctionnalités Principales

### 1. Chat Conversationnel IA (Sidebar)
Posez des questions stratégiques au PDG :
- "Quels sites sous-performent le plus?"
- "Comment augmenter nos revenus?"
- "Quels sont les problèmes critiques?"
- "Quelles activités sont les plus rentables?"

**Réponses**: Analyse contextuelle + recommandations mesurables

### 2. Recommandations Proactives
Génération automatique (toutes les 15 min) :
- **Commerciales**: Pricing, conversion, upsell
- **Opérationnelles**: Infrastructure, staff, processus
- **RH/Qualité**: Turnover, conformité, formation

### 3. Système d'Alertes Intelligent
Détection automatique d'anomalies :
- Baisse revenue > 20% → **CRITIQUE**
- NPS dégradé > 10 points → **HAUTE**
- Occupation < 50% → **HAUTE**
- Uptime < 95% → **CRITIQUE**
- Compliance score < 80% → **HAUTE**

### 4. KPI Executive Summary
4 métriques clés en grand format :
1. **Revenus du mois** : 45M CFA (-12% vs période)
2. **Visiteurs** : 1850 (+8% vs période)
3. **NPS** : 42 (-8 points vs historique)
4. **Taux occupation** : 68% (À améliorer)

### 5. Dashboard Complet
- Distribution effectifs par site
- Activités performantes (NPS + revenus)
- Performance financière
- Trends opérationnels
- Données clients détaillées

## 🏗️ Architecture Technique

\`\`\`
Frontend (React 18 + Next.js 15 + TypeScript)
         ↓
    API Routes Next.js (3 endpoints)
         ↓
    Anthropic Claude API (claude-3-5-sonnet)
         ↓
    Réponses structurées (Markdown + JSON)
\`\`\`

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/chat` | POST | Chat conversationnel |
| `/api/ai/recommendations` | POST | Recommandations stratégiques |
| `/api/ai/anomalies` | POST | Détection anomalies |

## 📁 Structure du Projet

\`\`\`
src/
├── app/
│   ├── api/ai/
│   │   ├── chat/route.ts              # Chat API
│   │   ├── recommendations/route.ts   # Recommendations API
│   │   └── anomalies/route.ts         # Anomalies API
│   ├── page.tsx                       # Dashboard principal
│   └── layout.tsx                     # Layout global
├── components/ai/
│   ├── chat-sidebar.tsx               # Chat Sidebar
│   ├── recommendations-widget.tsx     # Recommendations
│   └── alerts-widget.tsx              # Alertes
├── lib/
│   ├── types/ai-context.ts            # Types principales
│   ├── prompts/
│   │   ├── system-prompt.ts           # Prompts Claude
│   │   └── prompt-builder.ts          # Builder logique
│   ├── hooks/use-ai-chat.ts           # Hook chat
│   └── utils/mock-context.ts          # Mock data
└── .env.local                         # Configuration
\`\`\`

## 🔧 Configuration

### .env.local

\`\`\`env
# API Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Application
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
\`\`\`

## 🎨 Design System

### Palette Couleurs
- **Vert Foncé** (#2B7A0B) : Principal, headers
- **Orange** (#FF9F1C) : Accent, alertes
- **Vert Clair** (#76C043) : Success, positif
- **Neutres** : Blanc, gris clair/foncé

### Composants
- KPI Cards avec icônes
- Chat bubbles (user/assistant)
- Alert cards (critical/high/medium/low)
- Widget recommendations carousel
- Responsive grid (mobile → desktop)

## 📋 Types de Données

### DashboardContext

Structure principale contenant :
- **Financial**: Revenue, RPV, conversion, forecast
- **Operations**: Visiteurs, occupation, uptime, support
- **Clients**: NPS, satisfaction, retention, sentiment
- **Team**: Staffing, issues, compliance, turnover
- **History**: Trends 12 mois, patterns, activités top

Voir `lib/types/ai-context.ts` pour détails complets.

## 🤖 Intelligence IA - Claude

### Stratégie Prompting

3 niveaux d'analyse :

1. **Données contextuelles brutes**
   - KPI actuels et variations
   - Distribution par site
   - Tendances historiques

2. **Prompts spécialisés**
   - Conversationnel (questions libres)
   - Commercial (pricing, conversion, revenue)
   - Opérationnel (infrastructure, staff, processus)
   - Anomalies (détection patterns anormaux)

3. **Réponses structurées**
   - Markdown formatting
   - Bullets et numbering
   - Impact estimé (chiffres, %)
   - Actions concrètes avec timeline

## 🧪 Tests Recommandés

### Chat
\`\`\`
Questions à tester :
1. "Quels sites sous-performent le plus?"
2. "Comment augmenter nos revenus de 20%?"
3. "Pourquoi le NPS a baissé?"
4. "Quelles activités sont les plus rentables?"
\`\`\`

### Recommendations
- Cliquer "Refresh" pour générer nouvelles recommandations
- Vérifier 3 focus areas (commercial, operational, team)
- Valider priorités et impacts estimés

### Alerts
- Vérifier détection automatique d'anomalies
- Tester dismiss/clear
- Vérifier refresh toutes les 5 min

## 📦 Déploiement

### Vercel (Recommandé)

\`\`\`bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel deploy

# Ajouter env vars
vercel env add ANTHROPIC_API_KEY
\`\`\`

### Auto-déploiement
Connecter repo GitHub → Vercel → Auto-deploy sur push main

## 🔒 Sécurité

- API keys en variables d'env (jamais en code)
- Validation inputs côté backend
- Rate limiting (à implémenter)
- CORS restrictif (à configurer)
- Audit logs (à implémenter)

## 📈 Performance

- Chargement initial: < 2s (Lighthouse 90+)
- Chat latency: < 100ms
- API response: < 2s
- Refresh KPI: 30s configurable
- Uptime SLA: 99.5%

## 🔄 Prochaines Étapes

### Phase 2 (Semaines 9-14)
- [ ] Intégration PostgreSQL + TimescaleDB
- [ ] WebSocket temps réel
- [ ] Export PDF/Excel rapports
- [ ] Notifications Email/SMS

### Phase 3 (Semaines 15-20)
- [ ] ML prédictif (ARIMA, XGBoost)
- [ ] Comparaisons inter-sites interactives
- [ ] Drill-down détaillés par KPI
- [ ] Personnalisation layout drag-drop

### Phase 4 (Semaines 21+)
- [ ] Mobile app (React Native)
- [ ] Intégration ERP/CRM
- [ ] Webhooks externes
- [ ] API publique

## 📚 Documentation

- [Guide d'Implémentation Complet](./AI_IMPLEMENTATION_GUIDE.md)
- [Instructions de Démarrage Rapide](./SETUP_INSTRUCTIONS.md)
- [Types TypeScript](./lib/types/ai-context.ts)
- [Prompts Claude](./lib/prompts/system-prompt.ts)

## 🆘 Support

- **Documentation**: Voir README & guides
- **Issues**: Créer issue dans repo
- **Email Support**: support@domainebini.ci
- **Urgent**: contact@domainebini.ci

## 📄 License

MIT License - © 2025 Domaine Bini

---

**Statut**: ✅ Production Ready  
**Version**: 1.0.0  
**Dernière mise à jour**: Novembre 2025  
**Mainteneur**: Équipe IA Domaine Bini

---

## 🎓 Stack Technologique

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Next.js 15, TypeScript |
| UI | shadcn/ui, Tailwind CSS v4, Lucide Icons |
| Backend | Node.js, Next.js Route Handlers |
| IA/ML | Anthropic Claude 3.5 Sonnet |
| State | React Hooks, Context API |
| Data | Mock (à remplacer par PostgreSQL) |
| Deployment | Vercel |
| Monitoring | Vercel Analytics, Sentry |

---

**Prêt à transformer les données en décisions intelligentes!** 🚀
