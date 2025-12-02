# Tableau de Bord Intelligent Domaine Bini - Features Complètes

## Vue d'ensemble

Ce document récapitule toutes les fonctionnalités implémentées dans le Tableau de Bord Intelligent PDG Domaine Bini.

## 8 Onglets Principaux

### 1. Vue d'Ensemble (Overview)
- **4 KPI Cards**: Revenus, Visiteurs, Note Moyenne, Occupation
- **Filtres Date**: Jour, Semaine, Mois, Année
- **Graphiques Highcharts**:
  - Revenus par Site (Histogramme)
  - Taux d'Occupation (Barres)
  - Sentiment Avis Clients (Camembert)
  - Provenance des Touristes (Pie Chart)

**Données Fictives Source**: `/public/data/visitors-origin.json`
- Côte d'Ivoire (38.5%) - 2,450 visiteurs
- Sénégal (20.1%) - 1,280 visiteurs
- France (15.4%) - 980 visiteurs
- Burkina Faso, USA, Belgique, Guinée, Canada

### 2. Gestion des Sites (Sites)
**Opérations CRUD Complètes**:
- Ajouter un site (formulaire modal)
- Éditer un site
- Supprimer un site (avec confirmation)
- Fermer un site pour événement spécial
- Voir statut (active/maintenance/fermé)

**Données Affichées**:
- Nom, Région, Capacité, Visiteurs actuels
- Revenue mensuelle, Occupancy rate, Rating
- Manager responsable

### 3. Gestion des Employés (Employees)
**Opérations CRUD Complètes**:
- Ajouter un employé (prénom, nom, poste, site, email, téléphone, salaire)
- Éditer un employé
- Supprimer un employé
- Gérer statut (Actif, Congé, Inactif)

**Tableau Multi-colonnes**:
- Nom, Poste, Site, Email, Téléphone, Salaire
- Filtrage/tri par site

### 4. Avis Clients + Analyse IA (Reviews)
- Tableau tous les avis avec note, sentiment
- Résumé analytics (Total, Note Moyenne, % Positifs)
- **Bouton "Analyser"**: Utilise Claude IA pour:
  - Déterminer sentiment (-1 à +1)
  - Identifier problèmes clés
  - Recommander actions
  - Évaluer urgence

### 5. Assistant IA Stratégique (IA)
- **Chat Conversationnel**: Poser des questions libres
- **6 Questions Prédéfinies**:
  1. "Quel site sous-performe le plus et pourquoi?"
  2. "Comment augmenter les revenus de 20% en 3 mois?"
  3. "Quels sont les problèmes majeurs identifiés?"
  4. "Recommande une stratégie pour améliorer le NPS"
  5. "Analyse la satisfaction des clients par site"
  6. "Quels employés montrent des signes de churn?"

**Réponses IA**: Markdown formaté avec insights actionnables

### 6. Génération de Rapports (Reports)
**6 Types de Rapports**:
1. Rapport Exécutif (8 pages) - Synthèse KPI pour PDG
2. Rapport Financier (12 pages) - Analyse revenus détaillée
3. Rapport Opérationnel (10 pages) - Performance sites/équipes
4. Rapport Satisfaction (6 pages) - Analyse avis/NPS
5. Rapport Anomalies (4 pages) - Alertes et incidents
6. Rapport Stratégique (15 pages) - Recommandations 30/60/90j

**Génération**: Utilise Claude IA + Template HTML-to-PDF
**Téléchargement**: Fichier PDF nommé `Rapport_[type]_[date].pdf`

### 7. Système d'Alertes (Alerts)
**Détection Automatique d'Anomalies**:
- Baisse revenus > 20% (Sévérité: HIGH)
- Occupation < 50% (Sévérité: MEDIUM)
- Avis négatifs > 2 (Sévérité: HIGH)
- Sites fermés/maintenance (Sévérité: CRITICAL)
- Absences employés > 3 (Sévérité: MEDIUM)

**Statistiques**: Compteurs par niveau de sévérité
**Actions**:
- Générer rapport automatique d'anomalie
- Télécharger rapport PDF
- Dismisser alerte

### 8. Instructions aux Managers (Instructions)
**Envoi Multi-Sites**:
- Sélectionner sites individuels OU envoyer à TOUS les sites
- Création instruction avec formulaire modal

**Propriétés Instruction**:
- Titre, Contenu détaillé
- Priorité: Urgent (🔴), Normal (🟡), Info (🔵)
- Statut: Nouveau, Lu, Exécuté
- Date limite: Automatiquement 7 jours

**Managers Ciblés**: Affichage du manager responsable pour chaque site

## Filtres Temporels Globaux

Disponible dans l'onglet Vue d'Ensemble:
\`\`\`
[Jour] [Semaine] [Mois] [Année]
\`\`\`

Affecte les KPI et graphiques affichés.

## Intégration Claude AI

### 3 API Routes Principales

1. **POST `/api/ai/analyze-metrics`**
   - Input: Question + contexte (sites, employees, reviews)
   - Output: Analyse markdown

2. **POST `/api/reports/generate`**
   - Input: Type rapport + contexte
   - Output: Contenu rapport + titre

3. **POST `/api/reports/anomaly`**
   - Input: Type anomalie + sévérité + contexte
   - Output: Rapport d'anomalie structuré

## Données Fictives

### Fichiers JSON Source

\`\`\`
/public/data/
├── sites.json (11 sites écotourisme)
├── employees.json (10 employés)
├── reviews.json (10 avis clients)
└── visitors-origin.json (8 pays d'origine)
\`\`\`

### Exemple Site (Données Enrichies)
\`\`\`json
{
  "id": "site-001",
  "name": "Bini Forêt",
  "region": "Yamoussoukro",
  "capacity": 150,
  "currentVisitors": 87,
  "status": "active",
  "manager": "Jean Kouadio",
  "revenue": 2450000,
  "monthlyRevenue": 45000,
  "occupancyRate": 58,
  "rating": 4.6
}
\`\`\`

## Architecture Complète

\`\`\`
Frontend (React 18 + Next.js 15)
├── Components
│   ├── dashboard-tabs.tsx (Navigation 8 onglets)
│   ├── tabs/
│   │   ├── overview-tab.tsx (KPI + graphiques + filtres)
│   │   ├── sites-tab.tsx (CRUD sites)
│   │   ├── employees-tab.tsx (CRUD employés)
│   │   ├── reviews-tab.tsx (Avis + IA)
│   │   ├── ai-analysis-tab.tsx (Chat IA)
│   │   ├── reports-tab.tsx (Génération rapports)
│   │   ├── alerts-tab.tsx (Alertes + rapports anomalies)
│   │   ├── instructions-tab.tsx (Instructions multi-sites)
│   ├── charts/ (Highcharts)
│   │   ├── revenue-chart.tsx
│   │   ├── occupancy-chart.tsx
│   │   ├── sentiment-chart.tsx
│   │   ├── rating-chart.tsx
│   │   ├── visitor-origin-chart.tsx
│   ├── pdf-template.tsx (Template rapport PDF)
│   ├── date-filter.tsx (Filtre temporel)
├── Hooks
│   ├── use-auth.ts (Authentification)
│   ├── use-dashboard-data.ts (Chargement données)
├── API Routes
│   ├── /api/ai/analyze-metrics (Analyse IA)
│   ├── /api/reports/generate (Génération rapports)
│   ├── /api/reports/anomaly (Rapports anomalies)
│   ├── /api/ai/analyze-review (Analyse avis)
└── Pages
    ├── /auth (Login)
    ├── /dashboard (Dashboard principal)
    └── / (Redirection)
\`\`\`

## Flux Utilisateur Complet

### PDG Accède au Dashboard

\`\`\`
1. Visite http://localhost:3000
   ↓
2. Redirect vers /auth (si pas authentifié)
   ↓
3. Se connecte (pdg@domainebini.ci / admin123)
   ↓
4. Accès Dashboard avec 8 onglets
\`\`\`

### Gestion Anomalie

\`\`\`
Anomalie Détectée (Auto)
   ↓ (dans Onglet Alertes)
Alerte Créée + Stats
   ↓ (PDG clique "Générer Rapport")
Rapport IA Généré (Claude)
   ↓ (PDG clique "Télécharger")
PDF Téléchargé (HTML-to-PDF)
   ↓ (PDG clique "Créer Instruction")
Onglet Instructions → Envoyer à site(s)
   ↓
Manager Reçoit Instruction
\`\`\`

### Analyse Questions IA

\`\`\`
PDG Pose Question
   ↓ (Onglet IA)
Question → API /ai/analyze-metrics
   ↓
Claude Analyse Contexte (Sites, Employés, Avis)
   ↓
Réponse Markdown Affichée
   ↓
PDG Lit Insights + Recommandations
\`\`\`

## Sécurité & Authentification

- JWT Token (localStorage)
- 2 rôles: PDG (accès complet), Coordinateur (read-only)
- Session timeout: 30 min
- Données sensibles: Salaires, revenus, etc.

## Performance

- Lazy loading des graphiques (dynamic import)
- Données en cache client
- Highcharts optimisé pour mobile
- Responsive design (Mobile/Tablet/Desktop)

## Próximas Etapes (Phase 2)

- [ ] Intégration PostgreSQL + TimescaleDB
- [ ] Authentification Supabase
- [ ] Notifications temps réel (WebSocket)
- [ ] Export Excel/CSV
- [ ] Statistiques saisonnières ML
- [ ] Mobile app native
- [ ] Multi-langue support
- [ ] Audit logging complet

## Déploiement

\`\`\`bash
# Vercel Deploy
vercel deploy

# Variables d'environnement requises:
ANTHROPIC_API_KEY=sk-ant-xxxxx
\`\`\`

## Support

Pour toute question ou bug: support@domainebini.ci
\`\`\`

```typescript file="" isHidden
