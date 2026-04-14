# Guide de Consultation de la Base de Données

Ce fichier contient les commandes nécessaires pour inspecter le contenu de la base de données PostgreSQL de **NearbyChat**.

## 1. Connexion au conteneur Docker
Pour entrer dans la base de données, ouvrez un terminal (PowerShell ou CMD) à la racine du projet et tapez :

```bash
docker exec -it nearbychat-postgis psql -U nearbychat -d nearbychat_db
```

---

## 2. Commandes de Navigation (psql)
Une fois connecté, utilisez ces raccourcis :
- `\dt` : Lister toutes les tables.
- `\d nom_table` : Voir les colonnes d'une table spécifique.
- `\q` : Quitter l'interface psql.

---

## 3. Requêtes SQL utiles

### Voir les Utilisateurs inscrits
```sql
SELECT id, username, "avatarUrl", "createdAt" FROM users;
```

### Voir les Zones créées
```sql
-- ST_AsText permet de lire les coordonnées géographiques du polygone
SELECT id, name, color, ST_AsText(polygon) FROM zones;
```

### Voir les derniers Messages
```sql
SELECT m.id, m.text, u.username, z.name as zone_name, m."createdAt"
FROM messages m
LEFT JOIN users u ON m."userId" = u.id
LEFT JOIN zones z ON m."zoneId" = z.id
ORDER BY m."createdAt" DESC;
```

---

## 4. Connexion via Outil Graphique (DBeaver, pgAdmin, etc.)
Si vous utilisez un logiciel externe, voici les paramètres :

- **Hôte** : `localhost`
- **Port** : `5432`
- **Base de données** : `nearbychat_db`
- **Utilisateur** : `nearbychat`
- **Mot de passe** : `nearbychat_pass`
