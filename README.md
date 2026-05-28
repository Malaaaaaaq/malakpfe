# 🅿️ ParLak — Plateforme Intelligente de Stationnement

**ParLak** est une plateforme web de réservation de places de parking qui connecte **clients**, **agents** et **administrateurs**. Développée avec **Laravel 12** (API REST) et **React 19** (SPA), elle permet de localiser, réserver et gérer des places de stationnement en temps réel.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [API](#-api)
- [Rôles](#-rôles)
- [Captures d'écran](#-captures-décran)
- [Auteurs](#-auteurs)

---

## ✨ Fonctionnalités

### 👤 Client
| Fonctionnalité | Détails |
|---|---|
| 🔐 Authentification | Inscription, connexion, déconnexion (token Sanctum) |
| 🚗 Gestion des véhicules | Ajout, modification, suppression (plaque, marque, modèle, couleur, type) |
| 📍 Recherche de parkings | Par ville, avec géolocalisation et carte Leaflet interactive |
| 🅿️ Réservation | Sélection d'une place sur plan interactif, choix date/heure/durée |
| 🎟️ Codes promo | Application de codes promo avec calcul automatique de la réduction |
| 📱 QR code | Génération et téléchargement d'un QR code d'accès unique |
| ✉️ Confirmation par email | Email envoyé automatiquement après réservation |
| 👤 Profil | Modification des informations personnelles |
| 📋 Historique | Liste de toutes les réservations avec statut |

### 🧑‍💼 Agent
| Fonctionnalité | Détails |
|---|---|
| 📊 Tableau de bord | Statistiques en temps réel (places libres, réservations du jour) |
| 🅿️ Gestion des places | Grille interactive avec changement de statut par clic (libre/occupé) |
| 📋 Réservations | Liste avec actions de confirmation/refus |
| ⚙️ Paramètres | Modification des informations du parking (nom, adresse, coordonnées) |

### 👑 Administrateur
| Fonctionnalité | Détails |
|---|---|
| 📈 Statistiques | Revenus, taux d'occupation, parkings actifs, agents, réservations |
| 🏢 Gestion des parkings | CRUD complet avec formulaire |
| 👥 Gestion des agents | Création, modification, suppression |
| 🎁 Codes promo | Création, activation/désactivation, envoi par email aux abonnés |
| 📧 Newsletter | Envoi de codes promo à tous les abonnés en un clic |
| 📄 Export CSV | Exportation des réservations |

---

## 🏗 Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │   Backend       │      │   Base de       │
│   React 19      │◄────►│   Laravel 12    │◄────►│   Données       │
│   Vite 7        │ REST │   Sanctum Auth  │      │   MySQL         │
│   Leaflet       │  API │   SMTP Mail     │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

L'application suit une architecture **REST API-first** :
- Le frontend React communique exclusivement via des requêtes HTTP JSON
- L'authentification est gérée par **Laravel Sanctum** (tokens stockés dans localStorage)
- Les emails transactionnels sont envoyés via **Gmail SMTP**
- La cartographie utilise **Leaflet** avec **react-leaflet**

---

## 🛠 Stack technique

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| PHP | 8.2+ | Langage serveur |
| Laravel | 12 | Framework MVC |
| Laravel Sanctum | * | Authentification API |
| MySQL | 8+ | Base de données |
| Gmail SMTP | - | Envoi d'emails |

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| React | 19 | Bibliothèque UI |
| Vite | 7 | Build tool |
| Leaflet / react-leaflet | 1.9 / 5.0 | Cartographie interactive |
| Lucide React | 0.563 | Iconographie |
| Lottie React | 2.4 | Animations vectorielles |
| Styled Components | 6.3 | CSS-in-JS |

### Outils
- **Git** — Gestion de versions
- **Composer** — Dépendances PHP
- **npm** — Dépendances JavaScript

---

## 📦 Prérequis

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8+
- Serveur Laravel (PHP built-in ou Apache/Nginx)

---

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd MyPfe
```

### 2. Backend
```bash
cd backend
composer install
cp .env.example .env   # ou utilisez le .env existant
php artisan key:generate
php artisan migrate --seed
```

### 3. Frontend
```bash
cd pfemalak
npm install
```

---

## ⚙️ Configuration

### Base de données (`.env` backend)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=parlak_db
DB_USERNAME=root
DB_PASSWORD=
```

### Email (`.env` backend)
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=malaktamrani6@gmail.com
MAIL_PASSWORD=xxxxx
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=malaktamrani6@gmail.com
MAIL_FROM_NAME="ParLak"
```

### Frontend (`.env.local`)
```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 🚀 Lancement

### Démarrer le backend
```bash
cd backend
php artisan serve
# → http://127.0.0.1:8000
```

### Démarrer le frontend
```bash
cd pfemalak
npm run dev
# → http://localhost:5173
```

### Démarrer les deux simultanément (backend)
```bash
cd backend
php artisan dev
```

---

## 📁 Structure du projet

```
MyPfe/
├── backend/                          # API Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/API/      # 8 contrôleurs
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── AdminController.php
│   │   │   │   ├── ParkingController.php
│   │   │   │   ├── ReservationController.php
│   │   │   │   ├── VehicleController.php
│   │   │   │   ├── PromoController.php
│   │   │   │   └── UserController.php
│   │   │   └── Middleware/
│   │   │       └── EnsureAdmin.php
│   │   ├── Mail/                     # 3 classes Mailable
│   │   │   ├── WelcomeNewsletter.php
│   │   │   ├── ReservationConfirmed.php
│   │   │   └── PromoCodeEmail.php
│   │   └── Models/                   # 9 modèles
│   ├── database/
│   │   ├── migrations/               # 16 migrations
│   │   └── seeders/                  # 4 seeders
│   ├── resources/views/emails/       # Templates email
│   └── routes/api.php                # 48 endpoints API
│
└── pfemalak/                         # Frontend React 19
    └── src/
        ├── components/               # 24 composants
        │   ├── ClientDashboard.jsx
        │   ├── AdminPage.jsx
        │   ├── AgentPage.jsx
        │   ├── Login.jsx
        │   ├── inscription.jsx
        │   └── ...
        ├── animations/               # Animations Lottie
        └── assets/                   # Images
```

---

## 🗄 Base de données

### Tables principales (9)

| Table | Rôle |
|---|---|
| `users` | Utilisateurs (client, agent, admin) |
| `parkings` | Parkings avec géolocalisation |
| `parking_zones` | Zones d'un parking (A, B, C, D) |
| `parking_spots` | Places individuelles avec statut |
| `reservations` | Réservations avec QR code |
| `vehicles` | Véhicules des clients |
| `promo_codes` | Codes promotionnels |
| `cities` | Villes |
| `newsletter_subscribers` | Abonnés newsletter |

### Relations clés
- **users** 1──N **vehicles** : un client peut avoir plusieurs véhicules
- **users** 1──N **reservations** : un utilisateur peut avoir plusieurs réservations
- **cities** 1──N **parkings** : une ville contient plusieurs parkings
- **parkings** 1──N **zones** : un parking a plusieurs zones
- **zones** 1──N **spots** : une zone contient plusieurs places

---

## 🌐 API

**48 endpoints** organisés en 4 niveaux d'accès :

| Niveau | Middleware | Routes |
|---|---|---|
| **Publique** | Aucun | Parkings, Villes, Auth, Newsletter |
| **Client** | `auth:sanctum` | Profil, Véhicules, Réservations, Promos |
| **Agent** | `auth:sanctum` | Réservations agent, Places, Parking |
| **Admin** | `auth:sanctum` + `admin` | Dashboard, Parkings, Agents, Promos |

---

## 👥 Rôles

| Rôle | Accès |
|---|---|
| **Client** | Réserver une place, gérer ses véhicules, appliquer des codes promo, voir son historique |
| **Agent** | Gérer les places de son parking, confirmer/refuser les réservations, modifier les paramètres |
| **Admin** | Gérer tous les parkings, agents, codes promo, statistiques globales, export CSV |

---

## 👩‍💻 Auteurs

- **Malak BOUDAD** — Développeuse Full Stack
- **Fatima BOUGROUN** — Développeuse Full Stack

**ISTA NTIC Hay Salam – Nador**  
Filière : Développement Informatique  
Année universitaire : 2025/2026

---

## 📄 Licence

Projet académique — Tous droits réservés.
