# Tableau de Bord Intelligent PDG - Domaine Bini

## Vue d'ensemble

Ce tableau de bord complet offre au PDG une visibilité complète sur les 11 sites d'écotourisme de Domaine Bini avec:
- Interface de connexion sécurisée
- Vue d'ensemble avec 4 KPI principaux
- Graphiques interactifs Highcharts
- Gestion CRUD des sites
- Gestion CRUD des employés
- Affichage et analyse IA des avis clients
- Alertes et notifications intelligentes

## Accès à l'Application

### 1. Page de Connexion (`/auth`)
Identifiants de démonstration:
- **PDG:** pdg@domainebini.ci / admin123
- **Coordinateur:** coordinator@domainebini.ci / admin123

### 2. Tableau de Bord (`/dashboard`)
Après connexion, accédez au tableau de bord avec 4 onglets principaux.

## Onglets Disponibles

### Onglet 1: Vue d'Ensemble
- **4 KPI Principales:**
  - Revenus Totaux (en millions CFA)
  - Visiteurs Actuels
  - Note Moyenne (1-5)
  - Taux d'Occupation Moyenne (%)

- **4 Graphiques Highcharts:**
  - Revenus par Site (Histogramme)
  - Taux d'Occupation (Diagramme en barres)
  - Sentiment Avis Clients (Camembert)
  - Note par Site (Graphique de dispersion)

### Onglet 2: Gestion des Sites
Actions disponibles:
- **Ajouter un site:** Cliquez sur "Ajouter un Site"
  - Nom, Région, Responsable, Capacité
  - Site créé automatiquement avec ID unique
  
- **Éditer un site:** Cliquez sur l'icône crayon
  - Modifiez toutes les informations
  
- **Supprimer un site:** Cliquez sur l'icône poubelle
  - Confirmation requise
  
- **Fermer un site (événement spécial):** Cliquez sur l'icône d'alerte
  - Status passe à "Fermé"
  - Peut être rouvert en éditant

### Onglet 3: Gestion des Employés
Actions disponibles:
- **Ajouter un employé:** Cliquez sur "Ajouter un Employé"
  - Prénom, Nom, Poste (Manager/Guide/Accueil/Technique)
  - Site assigné, Email, Téléphone
  - Salaire mensuel, Statut
  
- **Éditer un employé:** Cliquez sur l'icône crayon
  - Modifiez tous les détails
  - Changez le statut (Actif/Congé/Inactif)
  
- **Supprimer un employé:** Cliquez sur l'icône poubelle
  - Confirmation requise

### Onglet 4: Analyse des Avis Clients
Fonctionnalités:
- **Résumé Analytics:**
  - Total Avis
  - Note Moyenne
  - Avis Positifs
  - Taux de Satisfaction

- **Tableau des Avis:**
  - Filtrage par sentiment (Positif/Neutre/Négatif)
  - Note en étoiles
  - Identification des problèmes clés

- **Analyse IA Claude:**
  - Cliquez sur "Analyser" pour chaque avis
  - Récoit:
    - Résumé IA du sentiment
    - Score de sentiment (-1 à +1)
    - Problèmes identifiés
    - Actions recommandées
    - Priorité (Haute/Moyenne/Basse)

## Données Fictives

### Sources JSON
- `/public/data/sites.json` - 11 sites avec données complètes
- `/public/data/employees.json` - Employés assignés par site
- `/public/data/reviews.json` - Avis clients avec sentiment pré-analysé

### Structure des Données
Toutes les données sont chargées au démarrage et stockées en état local React pour:
- Performance optimale
- Pas de persistance (données réinitialisées au refresh)
- Parfait pour démonstration

## Module IA

### Intégration Claude
- API: `/api/ai/analyze-review`
- Modèle: claude-3-5-sonnet-20241022
- Fonction: Analyse sentiment et recommandations

### Analyse Automatique
Chaque avis reçoit une analyse structurée:
1. **Résumé:** Synthèse contextuelle en français
2. **Sentiment:** Score -1 (négatif) à +1 (positif)
3. **Problèmes:** Listes des soucis identifiés
4. **Actions:** Recommandations concrètes
5. **Priorité:** Niveau d'urgence

## Navigation et UX

### Responsive Design
- Mobile: 1 colonne
- Tablette: 2 colonnes
- Desktop: Colonnes multiples

### Barre d'En-tête
- Logo Domaine Bini
- Nom utilisateur et rôle
- Bouton Déconnexion

### Interactions
- Dialogues modaux pour ajout/édition
- Confirmations avant suppression
- Chargement en temps réel
- Messages d'erreur explicites

## Cas d'Usage PDG

### 1. Suivi Quotidien
- Ouvre le dashboard
- Consulte les 4 KPI principales
- Vérifie les graphiques tendance
- Lit les avis clients négatifs

### 2. Gestion d'Urgence
- Site fermé pour maintenance
- Va à l'onglet Sites
- Clique sur l'icône alerte
- Site passe au statut "Fermé"

### 3. Analyse Client
- Voit un avis avec note basse
- Va à l'onglet Avis
- Clique "Analyser" avec IA
- Reçoit recommandations d'action

### 4. Gestion RH
- Employé en congé
- Va à l'onglet Employés
- Édite l'employé
- Change statut à "Congé"

## Configuration Requise

### Variables d'Environnement
\`\`\`
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
\`\`\`

### Dépendances Clés
- Next.js 15+
- React 18+
- Highcharts (CDN)
- AI SDK (Anthropic)
- shadcn/ui

## Dépannage

### Les graphiques ne s'affichent pas
- Vérifiez la connexion Internet (Highcharts est en CDN)
- Ouvrez la console pour les erreurs

### L'analyse IA échoue
- Vérifiez la clé ANTHROPIC_API_KEY
- Vérifiez la limite d'utilisation API

### Les données ne persistent pas
- C'est normal pour une démo
- Données réinitialisées au refresh du page

## Prochaines Étapes

Pour production:
1. Connecter à une base de données réelle (PostgreSQL)
2. Ajouter authentification OAuth
3. Implémenter persistence des données
4. Ajouter export PDF/Excel
5. Ajouter notifications email
6. Intégrer paiements Stripe pour e-commerce
