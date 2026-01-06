# YouShop - E-commerce Backend Platform

Une plateforme e-commerce backend performante et scalable conçue pour orchestrer les opérations d'une plateforme e-commerce moderne. YouShop centralise la gestion du catalogue produits, le suivi rigoureux des stocks (SKU) et l'automatisation du cycle de vie des commandes, avec une sécurité optimale via une authentification robuste.

## 📋 Table des Matières

- [Aperçu](#aperçu)
- [Stack Technique](#stack-technique)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Tests](#tests)
- [DevOps & Déploiement](#devops--déploiement)
- [Contribution](#contribution)

## 🎯 Aperçu

YouShop est une solution backend entièrement modulaire basée sur **NestJS** qui implémente quatre domaines clés :

1. **Identity (Auth)** : Authentification, inscription, connexion avec JWT et gestion des rôles
2. **Display (Catalog)** : CRUD des produits avec filtrage par catégorie et gestion des prix
3. **Storage (Inventory)** : Gestion des stocks par SKU avec réservation automatique
4. **Workflow (Orders)** : Création et gestion du cycle de vie des commandes

## 🔧 Stack Technique

| Composant | Technologie |
|-----------|-------------|
| **Framework** | NestJS (Architecture modulaire) |
| **Langage** | TypeScript (Typage strict) |
| **Base de Données** | PostgreSQL |
| **ORM** | Prisma (Type-safe queries) |
| **Authentification** | Passport.js, JWT, Bcrypt |
| **Validation** | Class-validator, Class-transformer |
| **Documentation API** | Swagger / OpenAPI |
| **Tests** | Jest, Supertest |
| **Container** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Monitoring** | PM2, Winston (Logging) |
| **Déploiement** | AWS |

## ✨ Fonctionnalités

### Pour les Visiteurs (Non-Authentifiés)
- ✅ Consultation du catalogue avec pagination
- ✅ Filtrage par catégorie et prix
- ✅ Consultation des détails des produits
- ✅ Affichage des stocks disponibles

### Pour les Clients (Authentifiés)
- ✅ Inscription sécurisée avec hachage de mot de passe
- ✅ Connexion avec JWT
- ✅ Création de commandes avec réservation de stock
- ✅ Calcul automatique des prix (TVA incluse)
- ✅ Historique des commandes personnalisé
- ✅ Suivi de l'état des commandes (Pending, Paid, Cancelled)

### Pour les Administrateurs
- ✅ CRUD complet du catalogue
- ✅ Gestion des stocks par SKU
- ✅ Mise à jour manuelle des stocks
- ✅ Identification des produits en rupture
- ✅ Gestion des rôles et permissions

### Opérations Automatisées
- ✅ Réservation automatique de stock lors de la création de commande
- ✅ Libération du stock en cas d'annulation
- ✅ Validation stricte des données avant insertion en BD
- ✅ Caching du catalogue pour optimiser les performances

## 🚀 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- Docker et Docker Compose (optionnel)
- Git

### Étapes d'Installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/[votre-username]/youshop.git
cd youshop
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

4. **Initialiser la base de données**
```bash
npx prisma migrate dev
npx prisma db seed
```

5. **Démarrer l'application**
```bash
npm run start:dev
```

L'API sera disponible à `http://localhost:3000`

## ⚙️ Configuration

### Variables d'Environnement (.env)

```env
# Application
NODE_ENV=development
PORT=3000

# Base de Données
DATABASE_URL=postgresql://user:password@localhost:5432/youshop_db

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=3600

# AWS (optionnel)
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Logging
LOG_LEVEL=debug
```

### Configuration Docker

Lancez l'application complète avec Docker Compose :

```bash
docker-compose up -d
```

Cela démarre :
- Application NestJS (port 3000)
- PostgreSQL (port 5432)
- Redis (optionnel, pour le caching)

## 📖 Utilisation

### Exemples d'Utilisation

#### 1. S'inscrire
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### 2. Se connecter
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### 3. Consulter le catalogue
```bash
GET /products?page=1&limit=10&category=electronics&maxPrice=500
Authorization: Bearer your_jwt_token
```

#### 4. Créer une commande
```bash
POST /orders
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid-1",
      "quantity": 2
    }
  ]
}
```

## 🏗️ Architecture

### Structure du Projet

```
src/
├── auth/                 # Module d'authentification
│   ├── controllers/
│   ├── services/
│   ├── guards/
│   └── strategies/
├── catalog/              # Module du catalogue
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   └── entities/
├── inventory/            # Module d'inventaire
│   ├── controllers/
│   ├── services/
│   └── dto/
├── orders/               # Module des commandes
│   ├── controllers/
│   ├── services/
│   ├── events/
│   └── dto/
├── common/               # Code partagé
│   ├── interceptors/
│   ├── pipes/
│   ├── guards/
│   └── decorators/
├── database/             # Configuration Prisma
└── main.ts               # Point d'entrée
```

### Principes Architecturaux

- **Modularité** : Chaque domaine est encapsulé dans son propre module NestJS
- **Séparation des Responsabilités** : Services métier, Contrôleurs HTTP, Accès données
- **Validation Stricte** : Class-validator sur tous les DTOs
- **Sécurité** : Guards par rôles, JWT, Bcrypt pour les mots de passe
- **Type-Safety** : TypeScript strict, pas de `any`

## 📚 API Documentation

La documentation API complète est disponible via **Swagger** :

```
http://localhost:3000/api/docs
```

### Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Inscription |
| POST | `/auth/login` | Connexion |
| GET | `/products` | Liste des produits |
| GET | `/products/:id` | Détails d'un produit |
| POST | `/products` | Créer un produit (Admin) |
| PUT | `/products/:id` | Modifier un produit (Admin) |
| POST | `/inventory/update` | Mettre à jour le stock (Admin) |
| POST | `/orders` | Créer une commande |
| GET | `/orders/:id` | Détails d'une commande |
| GET | `/orders` | Historique des commandes |

## 🧪 Tests

### Lancer les Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests E2E
npm run test:e2e

# Tests en mode watch
npm run test:watch
```

### Couverture des Tests

- **Cible** : 70% minimum des fonctionnalités
- **Services Critiques Testés** :
  - Calcul des prix (avec taxes)
  - Réservation et libération de stock
  - Authentification et autorisation
  - Validation des données

### Exemple de Test

```typescript
describe('OrderService', () => {
  it('should create order and reserve stock', async () => {
    const order = await orderService.create({
      userId: 'user-1',
      items: [{ productId: 'prod-1', quantity: 2 }]
    });
    expect(order.status).toBe('Pending');
  });
});
```

## 🐳 DevOps & Déploiement

### Docker

Build l'image Docker :

```bash
docker build -t youshop:latest .
```

Lancer le conteneur :

```bash
docker run -p 3000:3000 --env-file .env youshop:latest
```

### Docker Compose

Orchestrer l'application complète :

```bash
docker-compose up -d
docker-compose logs -f app
docker-compose down
```

### CI/CD avec GitHub Actions

Le workflow automatisé exécute :

1. **Linting** : ESLint et Prettier
2. **Tests** : Jest et Supertest
3. **Build** : Compilation TypeScript
4. **Docker** : Construction et push d'images

Vérifier le statut dans l'onglet "Actions" de GitHub.

### Déploiement sur AWS

1. **ECR** : Stockage des images Docker
2. **ECS/Fargate** : Exécution des conteneurs
3. **RDS** : Hosted PostgreSQL
4. **ALB** : Load balancing

```bash
# Déployer via GitHub Actions
git push origin main  # Déclenche le workflow de déploiement automatique
```

## 🔐 Sécurité

- ✅ Authentification JWT avec Passport.js
- ✅ Mots de passe hachés avec Bcrypt
- ✅ Helmet pour les headers HTTP sécurisés
- ✅ Validation stricte des entrées
- ✅ Guards NestJS pour les rôles (Admin/Client)
- ✅ CORS configuré correctement

## 📊 Monitoring & Logging

### Winston Logging

Les logs sont écrits dans :
- Console (développement)
- Fichiers (production)

```typescript
this.logger.log('Message d\'information');
this.logger.error('Erreur critique');
this.logger.warn('Avertissement');
```

### PM2 (Production)

Gérer le processus Node.js :

```bash
pm2 start dist/main.js --name youshop
pm2 monit
pm2 logs youshop
```

## 📝 Code Quality

### Standards Appliqués

- ✅ **Zero `any`** : Typage TypeScript strict
- ✅ **SRP** (Single Responsibility Principle)
- ✅ **DRY** (Don't Repeat Yourself)
- ✅ **ESLint & Prettier** : Formatage cohérent
- ✅ **Clean Code** : Noms explicites, commentaires pertinents

### Linter & Formatter

```bash
npm run lint           # Vérifier les erreurs
npm run lint:fix      # Corriger automatiquement
npm run format        # Formater avec Prettier
```

## 🚦 Bonus : Architecture Microservices

Une évolution du projet est possible vers une architecture distribuée :

### Défis du Bonus

- Extraction des services dans des dépôts distincts
- Communication asynchrone via RabbitMQ/Kafka
- API Gateway pour le routing
- Shared Library NPM pour les types
- Docker Compose orchestrant 4 NestJS + PostgreSQL + Redis + RabbitMQ

```bash
# Lancer tous les services
docker-compose -f docker-compose.microservices.yml up
```

## 📋 Livrables

- ✅ Code source structuré sur Git
- ✅ README complet et détaillé
- ✅ Diagrammes de classes et use cases
- ✅ Diagrammes de séquence (bonus)
- ✅ API documentée avec Swagger
- ✅ Tests unitaires (70% couverture)
- ✅ Dockerfile et docker-compose.yml
- ✅ Workflow GitHub Actions fonctionnel
- ✅ Déploiement AWS (optionnel)

## 📅 Timeline

- **Date de début** : 22/12/2025
- **Deadline** : 02/01/2026 (10 jours)
- **Semaine 1** : Fondations (Auth + Catalog)
- **Semaine 2** : Opérations (Inventory + Orders)

## 👨‍💼 Auteur

**Ayoub Mashate**  

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation Swagger sur `/api/docs`
- Vérifier les logs : `docker-compose logs app`

---

**Bon développement !** 🚀