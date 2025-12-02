# Guide de Démarrage Rapide

## 5 Minutes pour Commencer

### Étape 1: Installation
\`\`\`bash
git clone <repo>
cd dashboard
npm install
\`\`\`

### Étape 2: Configuration
Créez `.env.local`:
\`\`\`
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
\`\`\`

Obtenez votre clé: https://console.anthropic.com/

### Étape 3: Démarrage
\`\`\`bash
npm run dev
\`\`\`

### Étape 4: Connexion
- URL: http://localhost:3000
- Email: `pdg@domainebini.ci`
- Mot de passe: `admin123`

---

## Premier Accès - Exploration (10 minutes)

### 1. Vue d'Ensemble
- Observez les 4 KPI cards
- Changez le filtre temporel (Jour → Mois → Année)
- Consultez les graphiques

### 2. Gestion Sites
- Cliquez "Ajouter un site"
- Remplissez le formulaire
- Validez

### 3. Gestion Employés
- Cliquez "Ajouter un employé"
- Remplissez les champs
- Confirmez

### 4. Chat IA
- Onglet "IA"
- Cliquez sur une question prédéfinie
- Lisez la réponse

### 5. Génération Rapport
- Onglet "Rapports"
- Cliquez "Générer" sur un rapport
- Attendez génération
- Cliquez "Télécharger PDF"

### 6. Alertes & Anomalies
- Onglet "Alertes"
- Cliquez "Générer Rapport" sur une alerte
- Consultez le rapport généré

### 7. Instructions
- Onglet "Instructions"
- Cliquez "Créer une Instruction"
- Sélectionnez "Envoyer à TOUS les sites"
- Remplissez titre + contenu
- Envoyez

---

## Commandes Utiles

\`\`\`bash
# Développement
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint

# Type check
npm run type-check
\`\`\`

---

## Structure des Dossiers

\`\`\`
app/
├── auth/               # Page login
├── dashboard/          # Page dashboard principal
├── api/                # API routes (IA, Rapports)
└── page.tsx            # Page d'accueil (redirect)

components/
├── dashboard/
│   ├── dashboard-tabs.tsx      # Navigation 8 onglets
│   ├── tabs/                   # Contenu onglets
│   ├── charts/                 # Graphiques Highcharts
│   ├── pdf-template.tsx        # Template PDF
│   └── date-filter.tsx         # Filtre temporel
└── ai/                 # Composants IA

lib/
├── hooks/              # useAuth, useDashboardData
├── types/              # Types TypeScript
├── prompts/            # Prompts IA
└── utils/              # Utilitaires

public/data/            # Données fictives JSON
├── sites.json
├── employees.json
├── reviews.json
└── visitors-origin.json
\`\`\`

---

## FAQ Rapide

**Q: Comment changer les données fictives?**
A: Modifiez les fichiers JSON dans `/public/data/`

**Q: Où trouver ma clé API Anthropic?**
A: https://console.anthropic.com/account/keys

**Q: Puis-je utiliser une vraie base de données?**
A: Oui, remplacez `useDashboardData()` par une requête DB

**Q: Comment ajouter un nouvel onglet?**
A: Créez composant dans `/components/dashboard/tabs/`, importez dans `dashboard-tabs.tsx`

**Q: Comment personnaliser les couleurs?**
A: Modifiez `/app/globals.css` et les classes Tailwind

---

Vous êtes prêt! Explorez le dashboard et amusez-vous! 🚀
