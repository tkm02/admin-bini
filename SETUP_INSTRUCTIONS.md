# Instructions de Démarrage Rapide

## 5 Étapes pour Lancer le Dashboard

### Étape 1: Obtenir Clé API Anthropic
1. Aller à https://console.anthropic.com
2. Créer compte / Se connecter
3. Aller à "API Keys"
4. Créer nouvelle clé: "Domaine Bini Dashboard"
5. Copier la clé

### Étape 2: Configuration Environnement
\`\`\`bash
# Créer fichier .env.local
touch .env.local

# Ajouter votre clé
echo 'ANTHROPIC_API_KEY=sk-ant-xxxxx' >> .env.local
\`\`\`

### Étape 3: Installation Dépendances
\`\`\`bash
npm install
\`\`\`

### Étape 4: Démarrer Dev Server
\`\`\`bash
npm run dev
\`\`\`

### Étape 5: Tester
1. Ouvrir http://localhost:3000
2. Cliquer "Ouvrir IA" (barre de navigation)
3. Poser question: "Quels sites sous-performent?"
4. Attendre réponse Claude (2-3 secondes)

---

## Premiers Tests Recommandés

### Chat
- "Comment augmenter nos revenus?"
- "Quels sont les problèmes critiques?"
- "Quelle est ma prévision pour les 30 prochains jours?"

### Recommendations Widget
- Cliquer "Refresh" icon
- Attendre génération 3 recommandations
- Lire priorités/impacts

### Alerts Widget
- Observer anomalies détectées automatiquement
- Cliquer "Dismiss" sur une alerte
- Vérifier disparition

---

## Prochaines Étapes

1. Remplacer mock data par vraies données
2. Configurer PostgreSQL pour persistance
3. Ajouter authentification PDG
4. Déployer sur Vercel
5. Configurer monitoring + alertes

Voir AI_IMPLEMENTATION_GUIDE.md pour détails complets.
\`\`\`

```json file="" isHidden
