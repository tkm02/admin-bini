# Tableau de Bord Intelligent PDG - Domaine Bini

## Démarrage Rapide (5 minutes)

### 1. Installation
\`\`\`bash
npm install
\`\`\`

### 2. Configuration
Créez un fichier `.env.local`:
\`\`\`env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
\`\`\`

Obtenez votre clé API: https://console.anthropic.com/

### 3. Lancement
\`\`\`bash
npm run dev
\`\`\`

### 4. Accès
Ouvrez http://localhost:3000
- Vous serez redirigé vers `/auth`
- Identifiants de démo:
  - **PDG**: pdg@domainebini.ci / admin123
  - **Coordinateur**: coord@domainebini.ci / admin123

---

## Fonctionnalités Principales

### 🎯 8 Onglets du Dashboard

| Onglet | Description | Fonctionnalités |
|--------|-------------|-----------------|
| **Vue d'Ensemble** | KPI + Graphiques | 4 KPI cards, filtres (jour/semaine/mois/année), 5 graphiques Highcharts |
| **Sites** | Gestion sites | Ajouter, éditer, supprimer, fermer sites |
| **Employés** | Gestion RH | Ajouter, éditer, supprimer, gérer statuts |
| **Avis** | Retours clients | Tableau avis, analyse IA sentiment |
| **IA** | Chat stratégique | Questions libres + 6 questions prédéfinies |
| **Rapports** | PDF exportables | 6 types rapport, génération Claude, téléchargement PDF |
| **Alertes** | Anomalies auto | Détection automatique, rapports auto-générés |
| **Instructions** | Communication | Multi-sites ou tous les sites, priorités |

---

## Spécifications Détaillées

### Onglet Vue d'Ensemble

**KPI Cards** (4):
- Revenus Totaux (mois)
- Visiteurs Actuels
- Note Moyenne (NPS)
- Taux d'Occupation

**Filtres Temporels**: Jour | Semaine | Mois | Année

**Graphiques Highcharts**:
1. Revenus par Site (Histogramme)
2. Taux d'Occupation (Barres)
3. Sentiment Avis (Pie chart)
4. Note par Site (Scatter)
5. **NOUVEAU**: Provenance Touristes (Pie chart)

### Provenance des Touristes (NOUVEAU)

Données fictives `/public/data/visitors-origin.json`:
\`\`\`
🇨🇮 Côte d'Ivoire    38.5% (2,450 visiteurs)
🇸🇳 Sénégal          20.1% (1,280 visiteurs)
🇫🇷 France           15.4% (980 visiteurs)
🇧🇫 Burkina Faso     10.2% (650 visiteurs)
🇺🇸 États-Unis        6.6% (420 visiteurs)
🇧🇪 Belgique          4.4% (280 visiteurs)
🇬🇳 Guinée            3.1% (200 visiteurs)
🇨🇦 Canada            1.8% (115 visiteurs)
\`\`\`

### Onglet Instructions (AMÉLIORÉ)

**Envoi Multi-Sites**:
- ☑️ Checkbox "Envoyer à TOUS les sites"
- ✓ Sélection multiple sites individuels
- 📋 Tableau multi-sites d'affichage

**Propriétés Instruction**:
- Titre + Contenu détaillé
- Priorités: 🔴 Urgent | 🟡 Normal | 🔵 Info
- Statut: Nouveau | Lu | Exécuté
- Date limite: Auto +7 jours
- Managers ciblés: Affichés par site

### Onglet Rapports (AVEC PDF)

**6 Types Disponibles**:
1. Exécutif (8p) - Synthèse KPI
2. Financier (12p) - Revenus détaillés
3. Opérationnel (10p) - Performance sites/équipes
4. Satisfaction (6p) - NPS/Avis
5. Anomalies (4p) - Alertes/Incidents
6. Stratégique (15p) - Recommandations 30/60/90j

**Génération**:
- Claude IA génère contenu Markdown
- Template HTML-to-PDF personnalisé
- Logo placeholder + En-têtes
- Téléchargement automatique

**Fichier Généré**: `Rapport_[type]_[date].pdf`

### Onglet Alertes (AVEC RAPPORTS AUTO)

**Anomalies Détectées Automatiquement**:

| Anomalie | Seuil | Sévérité | Action |
|----------|-------|----------|--------|
| Baisse revenus | > 20% | 🔴 HIGH | Générer rapport |
| Faible occupation | < 50% | 🟡 MEDIUM | Générer rapport |
| Avis négatifs | > 2 | 🔴 HIGH | Générer rapport |
| Sites fermés | Fermé | 🔴 CRITICAL | Générer rapport |
| Absences staff | > 3 | 🟡 MEDIUM | Générer rapport |

**Boutons Action**:
- 📄 Générer Rapport (Claude IA)
- 📥 Télécharger PDF
- ✕ Dismisser alerte

---

## Architecture Technique

### Stack
- **Frontend**: React 18 + Next.js 15 + TypeScript
- **UI Components**: shadcn/ui
- **Charts**: Highcharts (CDN)
- **PDF**: HTML-to-PDF natif (window.print)
- **AI**: Claude 3.5 Sonnet via Anthropic SDK
- **Auth**: JWT (localStorage)

### Routes API

\`\`\`
POST /api/ai/analyze-metrics
  Input: { question, context: { sites, employees, reviews } }
  Output: { analysis: string }

POST /api/reports/generate
  Input: { reportType, context }
  Output: { content, type, generatedAt }

POST /api/reports/anomaly
  Input: { anomalyType, context, severity }
  Output: { report, timestamp, anomalyType }

POST /api/ai/analyze-review
  Input: { review }
  Output: { sentiment, problems, recommendations }
\`\`\`

### Données Fictives (`/public/data/`)

\`\`\`json
sites.json          // 11 sites
employees.json      // 10 employés
reviews.json        // 10 avis
visitors-origin.json // 8 pays
\`\`\`

### Hooks Personnalisés

\`\`\`typescript
useAuth()                 // Gestion authentification + JWT
useDashboardData()        // Chargement données + cache
\`\`\`

---

## Cas d'Usage Complets

### Cas 1: Détection Anomalie → Rapport → Instruction

\`\`\`
1. PDG Visite Onglet Alertes
   ↓
2. Alerte "Baisse Revenus" détectée
   ↓
3. PDG Clique "Générer Rapport"
   ↓
4. Claude IA génère rapport d'anomalie
   ↓
5. PDG Clique "Télécharger PDF"
   ↓
6. Fichier PDF téléchargé
   ↓
7. PDG Visite Onglet Instructions
   ↓
8. Crée Instruction "Réduire coûts" → Envoie à TOUS les sites
   ↓
9. Tous les managers reçoivent instruction
\`\`\`

### Cas 2: Analyse IA Question Libre

\`\`\`
1. PDG Visite Onglet IA
   ↓
2. Tape question: "Quel site sous-performe?"
   ↓
3. Clique "Analyser avec IA"
   ↓
4. Claude analyse sites + employees + reviews
   ↓
5. Réponse Markdown affichée avec insights
\`\`\`

### Cas 3: Génération Rapport Multi-Type

\`\`\`
1. PDG Visite Onglet Rapports
   ↓
2. Sélectionne "Rapport Exécutif"
   ↓
3. Clique "Générer"
   ↓
4. Claude génère rapport 8 pages
   ↓
5. Rapport apparaît en liste
   ↓
6. PDG Clique "Télécharger PDF"
   ↓
7. PDF Rapport_executive_2025-01-30.pdf créé
\`\`\`

---

## Filtres Temporels

Disponible dans **Onglet Vue d'Ensemble**:

\`\`\`
[Jour] [Semaine] [Mois] [Année]
\`\`\`

Impact:
- Recalcule les 4 KPI cards
- Recharge les graphiques
- Filtre les données affichées

---

## Données Enrichies (Nouveau)

Tous les sites ont maintenant:
- `monthlyRevenue` (revenus mensuels)
- `occupancyRate` (taux occupation %)
- `closureReason` (si fermé/maintenance)

Exemple:
\`\`\`json
{
  "id": "site-001",
  "name": "Bini Forêt",
  "occupancyRate": 58,
  "monthlyRevenue": 45000,
  "status": "active"
}
\`\`\`

---

## Authentification

### Utilisateurs de Démo
\`\`\`
Email: pdg@domainebini.ci
Password: admin123
Role: PDG (accès complet)

Email: coord@domainebini.ci
Password: admin123
Role: Coordinateur (read-only)
\`\`\`

### Sécurité
- JWT Token en localStorage
- Session timeout: 30 minutes
- Déconnexion: Bouton "Déconnexion" en header

---

## Déploiement

### Vercel (Recommandé)

\`\`\`bash
# Connexion
vercel login

# Déploiement
vercel deploy

# Définir variables d'env
vercel env add ANTHROPIC_API_KEY
# Puis entrer votre clé API
\`\`\`

### Variables d'Environnement
\`\`\`env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
\`\`\`

---

## Dépannage

### Erreur: "Internal Server Error" lors de génération rapport

**Cause**: API Claude non accessible ou clé invalide

**Solution**:
1. Vérifier `ANTHROPIC_API_KEY` dans `.env.local`
2. Vérifier connexion internet
3. Vérifier quota API Anthropic

### Erreur: Graphiques ne s'affichent pas

**Cause**: Highcharts CDN non chargé

**Solution**:
1. Vérifier connexion internet
2. Ouvrir DevTools → Network → vérifier chargement
3. Rafraîchir page (Ctrl+F5)

### Erreur: PDF ne télécharge pas

**Cause**: Navigateur bloque téléchargement

**Solution**:
1. Autoriser pop-ups/téléchargements
2. Essayer navigateur différent
3. Vérifier quarantaine antivirus

---

## Performance

- Page charge < 2s
- Graphiques lazy-loaded
- Données en cache client
- Réactive sur mobile

## Roadmap Phase 2

- [ ] PostgreSQL + TimescaleDB
- [ ] Supabase Auth
- [ ] Notifications temps réel
- [ ] Export Excel/CSV
- [ ] ML prédictif
- [ ] Mobile app
- [ ] Multi-langue
- [ ] Audit logs

---

## Support & Contact

Pour tout problème:
- Email: support@domainebini.ci
- Documentation: `/docs`
- Issues: GitHub Issues

---

**© 2025 Domaine Bini - Tous droits réservés**
