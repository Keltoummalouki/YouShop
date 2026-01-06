# YouShop : Une Plateforme E-commerce Évolutive

## Vue d'ensemble

YouShop est une solution backend performante et scalable conçue pour orchestrer les opérations d'une plateforme e-commerce moderne. L'application centralise la gestion du catalogue produits, le suivi rigoureux des stocks (SKU) et l'automatisation du cycle de vie des commandes, tout en garantissant une sécurité optimale via une authentification robuste.

---

## 1. Contexte et Objectifs

L'objectif de ce projet est de construire le backend de la plateforme YouShop en utilisant une architecture modulaire avec NestJS. Vous devrez implémenter quatre domaines clés : **Authentification**, **Catalogue**, **Inventaire**, et **Commandes**.

### Points clés

- Centraliser la gestion du catalogue produits et des stocks
- Automatiser le cycle de vie des commandes
- Garantir la sécurité via une authentification JWT robuste
- Mettre en place une architecture modulaire et scalable
- Préparer la voie vers une architecture microservices

---

## 2. Planning de Réalisation

### Semaine 1 : Fondations et Catalogue Public

**Identity (Auth)**
- Inscription et connexion avec JWT
- Gestion des rôles (Admin/Client)
- Hashage sécurisé des mots de passe (Bcrypt)

**Display (Catalog)**
- CRUD complet des produits
- Filtrage par catégorie et prix
- Documentation API (Swagger)

**Objectifs Techniques**
- Modules NestJS et encapsulation
- Controllers et Services
- DTOs basiques et validation
- Passport.js avec stratégie JWT

### Semaine 2 : Opérations et Intégrité

**Storage (Inventory)**
- Gestion des stocks par SKU (Stock Keeping Unit)
- Réservation automatique lors de la création de commande
- Libération du stock en cas d'annulation

**Workflow (Orders)**
- Création de commandes avec validation
- Calcul automatique des prix (TTC)
- Cycle de vie des commandes (Pending → Paid → Shipped/Cancelled)

**Objectifs Techniques**
- Interceptors pour logging et caching
- Pipes avancés pour validation personnalisée
- Introduction au pattern CQRS Lite
- Événements métier et réactions automatiques

---

## 3. Stack Technique Imposée

### Core Framework
- **Backend** : NestJS (Architecture modulaire et scalable)
- **Langage** : TypeScript (Typage strict, Interfaces, Generics, Enums)

### Base de Données
- **SGBD** : PostgreSQL
- **ORM** : Prisma (Accès DB type-safe et migrations)

### Sécurité & Validation
- **Authentification** : Passport.js + JWT (JSON Web Tokens)
- **Hashage** : Bcrypt
- **Middleware** : Helmet (Sécurisation des headers HTTP)
- **Validation** : Class-validator & Class-transformer

### Documentation & Testing
- **API Documentation** : Swagger / OpenAPI
- **Tests Unitaires** : Jest
- **Tests E2E** : Supertest

### DevOps & Monitoring
- **Containerisation** : Docker & Docker Compose
- **CI/CD** : GitHub Actions (Lint, Test, Build)
- **Gestion Processus** : PM2
- **Logging** : Winston

### Déploiement
- **Cloud** : AWS (Amazon Web Services)

---

## 4. Architecture Technique

### Principes de Conception

**Modulaire**
- Chaque domaine (Auth, Catalog, Inventory, Orders) encapsulé dans son propre module NestJS
- Dépendances explicites et testables
- Réutilisabilité des services

**Data Flow**
- Validation stricte des entrées via Class-validator
- Transformation via Pipes et Class-transformer
- DTOs pour délimiter les contrats API

**Points de Vigilance (Pédagogiques)**
- **TypeScript** : Utilisation avancée de Génériques pour les réponses API et les mises à jour de stock
- **NestJS Advanced** : Guards pour la sécurisation par rôles (RoleGuard)
- **Performance** : Interceptors pour caching simple du catalogue
- **SRP & DRY** : Séparation des préoccupations, pas de duplication de code

---

## 5. User Stories

### A. Utilisateur Non-Authentifié (Visiteur)

**Consultation Catalogue**
> En tant que visiteur, je veux consulter la liste des produits paginée afin de découvrir l'offre sans avoir à m'inscrire.

**Recherche & Filtre**
> En tant que visiteur, je veux filtrer les produits par catégorie et par prix pour trouver rapidement ce qui m'intéresse.

**Détails Produit**
> En tant que visiteur, je veux voir la description complète d'un produit pour m'assurer qu'il répond à mes besoins avant de créer un compte.

### B. Utilisateur Authentifié (Client)

**Inscription & Sécurité**
> En tant que nouveau client, je veux créer un compte sécurisé (mot de passe haché) pour pouvoir sauvegarder mes futures commandes.

**Passation de Commande**
> En tant que client, je veux valider mon panier (Order Creation) afin de réserver les produits sélectionnés et obtenir un récapitulatif du prix total (taxes incluses).

**Historique Personnel**
> En tant que client, je veux accéder à la liste de mes anciennes commandes pour suivre leur état d'avancement (Pending, Paid, Shipped, Cancelled).

### C. Gestionnaire de Catalogue (Admin)

**Gestion de l'Offre (CRUD)**
> En tant qu'admin, je veux ajouter, modifier ou masquer des produits du catalogue pour maintenir l'offre à jour.

**Logistique (Inventory)**
> En tant qu'admin, je veux mettre à jour manuellement le stock d'un produit via son SKU afin de garantir que les quantités affichées sont réelles.

**Surveillance de Stock**
> En tant qu'admin, je veux identifier les produits en rupture de stock via une liste dédiée pour anticiper les nouveaux approvisionnements.

### D. Logique Système (Opérations Automatisées)

**Réservation de Stock**
> Lorsqu'un client crée une commande, le système doit automatiquement réserver les items correspondants (increment reserved count) pour éviter qu'un autre client n'achète le même stock physique pendant le checkout.

**Annulation & Libération**
> Si une commande expire ou est annulée, le système doit automatiquement libérer le stock réservé afin qu'il redevienne disponible à la vente.

---

## 6. Bonus : Architecture Microservices

Une extension du projet est possible pour passer d'un "Monolithe Modulaire" à un système réellement distribué.

### Défis du Bonus

**Extraction des Services**
- Séparer physiquement les modules dans des dépôts ou dossiers distincts
- Chaque service avec sa propre instance NestJS et base de données

**Communication Asynchrone**
- Remplacer les appels directs par un message broker (RabbitMQ ou Kafka)
- Exemple : Order Service émet `order.created` → Inventory Service écoute et déduit le stock

**API Gateway**
- Implémenter une Gateway NestJS qui redirige les requêtes vers les bons microservices
- Gestion centralisée de l'authentification et du routing

**Shared Library**
- Créer un package NPM local ou dossier partagé pour DTOs et interfaces communes
- Assurer la cohérence des types entre services

**Déploiement Complexe**
- Orchestrer un docker-compose avec 4 conteneurs NestJS, PostgreSQL, Redis et RabbitMQ
- Configuration des volumes persistants et réseaux

---

## 7. Modalités Pédagogiques

- **Modalité** : Travail Individuel
- **Date de Début** : 22/12/2025
- **Deadline** : 02/01/2026
- **Durée Totale** : 10 jours

---

## 8. Modalités d'Évaluation

**Durée** : 30 minutes, organisées comme suit

1. **Démonstration Fonctionnelle** (5 minutes)
   - Présenter rapidement le contenu et la fonctionnalité du site Web
   - Montrer les cas d'usage clés en action

2. **Revue de Code** (10 minutes)
   - Montrer le code source
   - Expliquer brièvement comment il fonctionne
   - Mettre l'accent sur l'architecture modulaire et la qualité du code

3. **Mise en Situation** (15 minutes)
   - Questions sur les choix technologiques
   - Explication des patterns utilisés (Guards, Interceptors, Pipes)
   - Scénarios edge cases (gestion d'erreurs, transactions, etc.)

---

## 9. Livrables

### Code Source
- Dépôt Git avec structure claire et organisée
- Fichier README détaillé avec instructions de setup et d'exécution

### Conception
- Diagrammes de classes (Architecture des modules)
- Diagrammes de use cases
- ✨ Bonus : Diagrammes de séquence pour les workflows critiques

### API Documentée
- Swagger disponible sur `/api/docs`
- Tous les endpoints documentés avec exemples de requêtes/réponses

### Tests
- Couverture minimale de 70% des fonctionnalités
- Tests unitaires des services critiques
  - Calcul du prix (avec taxes)
  - Réservation et libération de stock
  - Gestion des rôles et authentification

### DevOps
- `Dockerfile` multi-stage optimisé
- `docker-compose.yml` avec tous les services
- Workflow GitHub Actions pour CI/CD
  - Lint (ESLint, Prettier)
  - Tests (Jest)
  - Build et push image Docker

---

## 10. Critères de Performance

### Qualité du Code
- **Zero 'any'** : Pas de `any` TypeScript, typage strict partout
- **SRP** : Single Responsibility Principle respecté
- **DRY** : Don't Repeat Yourself
- **Code Clean** : Noms explicites, fonctions concises, commentaires pertinents

### Validation & Intégrité
- **Aucune donnée invalide** ne doit atteindre la base de données
- Validation en entrée (DTOs) et en logique métier
- Gestion d'erreurs cohérente et explicite

### CI/CD
- **Pipeline GitHub Actions vert** au moment du rendu
- Toutes les vérifications doivent passer (lint, test, build)

### Tests
- **Couverture minimum 70%** des fonctionnalités critiques
- Tests unitaires pour la logique métier
- Tests E2E pour les flux complets (signup → order)

### DevOps
- **Images Docker fonctionnelles** et optimisées
- `docker-compose` exécutable sans erreur
- Logs centralisés et monitoring basique

---

## 11. Structure de Projet Recommandée

```
youshop/
├── src/
│   ├── auth/                 # Module Identity
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── dtos/
│   │   └── auth.module.ts
│   ├── catalog/              # Module Display
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dtos/
│   │   ├── interceptors/
│   │   └── catalog.module.ts
│   ├── inventory/            # Module Storage
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dtos/
│   │   └── inventory.module.ts
│   ├── orders/               # Module Workflow
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dtos/
│   │   └── orders.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── pipes/
│   │   ├── filters/
│   │   └── interfaces/
│   ├── config/
│   ├── database/
│   └── app.module.ts
├── test/
│   ├── auth.e2e.spec.ts
│   ├── catalog.e2e.spec.ts
│   └── ...
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── Dockerfile
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── .env.example
├── README.md
├── package.json
└── tsconfig.json
```

---

## 12. Checklist de Délivrable

- [ ] Code source sur Git (README complet)
- [ ] Modules NestJS bien séparés (Auth, Catalog, Inventory, Orders)
- [ ] Authentification JWT fonctionnelle
- [ ] CRUD Produits avec filtrage
- [ ] Gestion des stocks et réservations
- [ ] Cycle de vie des commandes
- [ ] Swagger documenté sur `/api/docs`
- [ ] Tests unitaires (70%+ couverture)
- [ ] Dockerfile et docker-compose.yml
- [ ] GitHub Actions CI/CD ✅
- [ ] Diagrammes (Classes, Use Cases)
- [ ] Zéro `any` TypeScript
- [ ] Validation stricte des inputs
- [ ] Pipeline CI vert au rendu

---

## Conclusion

YouShop est un projet d'envergure pédagogique visant à maîtriser les concepts avancés de NestJS, l'architecture modulaire, et les bonnes pratiques TypeScript. La réussite repose sur une compréhension claire des user stories, une implémentation rigoureuse des tests, et une architecture extensible vers les microservices.