# 📍 NearbyChat - Guide Technique & Architecture

Ce document explique en détail le fonctionnement interne de l'application NearbyChat, la liaison entre le Frontend (React Native) et le Backend (NestJS), ainsi que les mécanismes de géolocalisation en temps réel.

## 🏗️ Architecture Globale

NearbyChat est une application **Full-Stack** utilisant :
- **Frontend** : React Native (Expo), Zustand (Gestion d'état), Socket.io-client.
- **Backend** : NestJS (Node.js), TypeORM, Socket.io.
- **Base de données** : PostgreSQL avec l'extension **PostGIS** (pour les calculs géographiques).

---

## 🔐 1. Authentification (JWT)

Le flux de connexion est standard mais sécurisé :
1. L'utilisateur s'inscrit ou se connecte via `LoginScreen` ou `RegisterScreen`.
2. Le Backend vérifie les identifiants, génère un **Token JWT** et le renvoie au Frontend.
3. Le Frontend stocke ce token avec **Zustand** (`authStore.js`) et l'attache automatiquement à chaque requête API via un intercepteur Axios (`api.service.js`).
4. **Liaison Socket** : Dès que l'utilisateur est authentifié, le `AppNavigator` initialise la connexion Socket.io en envoyant le token dans le handshake pour sécuriser la communication temps réel.

---

## 🗺️ 2. Géolocalisation & Système de Zones

C'est le cœur de l'application. Contrairement à une messagerie classique, les salons de discussion sont basés sur la position GPS.

### Flux de Localisation :
1. **Frontend** : Dans `MapScreen.jsx`, l'application utilise `expo-location` pour suivre la position GPS de l'utilisateur en arrière-plan (`watchPositionAsync`).
2. **Événement Réseau** : Chaque fois que l'utilisateur bouge de plus de 10 mètres, le Frontend émet un événement `updateLocation` via Socket.io au Backend.
3. **Backend** : Le `ChatGateway` reçoit les coordonnées et appelle le `ZoneService`.

### Résolution de Zone (Logic Dynamic) :
Le Backend cherche si le point GPS est contenu dans un polygone existant en base de données via la fonction PostGIS `ST_Contains`.
- **Si une zone existe** : L'utilisateur est placé dans ce salon.
- **Si aucune zone n'existe (Mode Dynamique)** : Le système calcule une grille de 1km x 1km basée sur les coordonnées actuelles. Il crée alors **automatiquement** une nouvelle zone dans la base de données avec un nom et une couleur unique. Cela permet à l'application de fonctionner **partout dans le monde**.

---

## 💬 3. Chat en Temps Réel (WebSockets)

Le chat utilise les "Rooms" de Socket.io pour segmenter le trafic.

- **Rooms** : Chaque `zoneId` est une Room Socket.io. Quand vous entrez dans une zone, le serveur vous fait `join(zoneId)`.
- **Messages** :
    - Quand vous envoyez un message, il est d'abord enregistré en base de données (`MessageService`).
    - Ensuite, il est diffusé uniquement aux autres membres de la même zone (`client.to(zoneId).emit('newMessage')`).
- **Indicateur d'écriture** : L'événement `typing` est envoyé quand vous tapez du texte, déclenchant une animation chez les autres utilisateurs de votre zone.
- **Compteur d'utilisateurs** : Le `ChatGateway` maintient un décompte (`zoneUserCounts`) des connexions actives par zone et diffuse l'information via `userJoined` et `userLeft`.

---

## 🎨 4. Design & UI

- **Thème** : L'application utilise un thème **Clair/Blanc** pour le chat et un style **Google Maps** standard pour la carte.
- **Identité Visuelle** : La couleur principale est le bleu électrique (`#0A84FF`), utilisée pour les boutons, les bulles de messages sortants et les zones actives.

---

## 🛠️ Commandes Utiles

### Lancer le Backend :
```bash
cd NearbyChat_Backend
docker-compose up -d  # Lance la DB PostGIS
npm run start:dev     # Lance NestJS
```

### Lancer le Frontend :
```bash
cd NearbyChat
npx expo start
```

---

*NearbyChat - Créé pour connecter les gens, un kilomètre à la fois.*
