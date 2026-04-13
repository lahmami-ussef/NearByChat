# NearbyChat Backend

Structure backend pour l'application *NearbyChat* utilisant NestJS, PostgreSQL + PostGIS, et Socket.IO.

## Prérequis
- Node.js & npm
- Docker et Docker Compose

## 🚀 Installation & Lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```
2. **Lancer la base de données PostGIS** :
   ```bash
   docker-compose up -d
   ```
3. **Configurer les variables d'environnement** :
   Copier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
4. **Lancer le serveur en mode dev** :
   ```bash
   npm run start:dev
   ```
   *(Lors du premier lancement, TypeORM synchronise les tables automatiquement)*
5. **Seeder les zones géographiques (Rabat/Salé)** :
   Vérifiez que le serveur ou la base de données fonctionne, puis :
   ```bash
   npm run seed
   ```

## 📚 API et Fonctionnalités
- `POST /auth/register` : `{ username, password }`
- `POST /auth/login` : `{ username, password }`
- `GET /user/me` : Renvoie le profil (protégé)
- `POST /zone/resolve` : `{ latitude, longitude }` -> détermine le polygone via `ST_Contains`
- `GET /zone/all` : Liste toutes les zones
- `GET /messages/:zoneId` : Historique des 50 derniers messages

## ⚡ WebSocket (Socket.IO)
- **Authentification** : Fournir le header d'authentification `auth: { token: 'Bearer ...' }`.
- **`updateLocation`** : { latitude, longitude } -> Réservation côté serveur & assignation de la zone (renvoie `zoneAssigned`).
- **`sendMessage`** : { text } -> Renvoie `newMessage` avec l'historique et l'auteur.
- **`typing`** : Transmet `userTyping` aux autres utilisateurs de la zone actuelle.

## Architecture
- Mode MVC propre, chaque fonction a son module, resolver et service associés.
- Code lisible, typé en TS, respect des standards NestJS.

*Développé pour l'application Mobile NearbyChat.*
