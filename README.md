# maets-expressjs

## Présentation

Ce projet fournit une API backend développée à l'aide d'Express.js, exploitant Node.js pour la logique côté serveur et Docker pour la conteneurisation. Il intègre plusieurs solutions de base de données, notamment MongoDB et MariaDB, et utilise des jetons Web JSON (JWT) pour l'authentification. Ce projet utilise l'IDE Bruno.

## Principales fonctionnalités et avantages

*   **API RESTful :** développée avec Express.js pour traiter les requêtes API.
*   **Flexibilité de la base de données :** prend en charge à la fois MongoDB et MariaDB.
*   **Authentification :** implémente une authentification basée sur JWT pour un accès sécurisé.
*   **Conteneurisation :** fichier Dockerfile inclus pour un déploiement et une évolutivité faciles.
*   **Tests :** comprend des configurations pour les frameworks de test afin d'assurer une validation approfondie du code.
*   **Tests API** : collection Bruno IDE incluse pour faciliter les tests des points de terminaison API.
*   **Configuration** : utilise des fichiers `.env` pour une configuration flexible.

## Prérequis et dépendances

Avant de commencer, assurez-vous que vous remplissez les conditions suivantes :

*   **Node.js :** (version >= 14) [Télécharger Node.js](https://nodejs.org/)
*   **npm** (Node Package Manager) : généralement installé avec Node.js.
*   **Docker :** (pour la conteneurisation) [Télécharger Docker](https://www.docker.com/)
*   **Bruno IDE** : (requis pour les tests API) [Télécharger Bruno IDE](https://www.usebruno.com/)
*   **Prettier** : (extension VSCode pour le formattage)

## Instructions d'installation et de configuration

Suivez ces étapes pour configurer le projet :

1.  **Clonez le référentiel :**

    ```bash
    git clone <repository_url>
    cd maets-expressjs
    ```

2.  **Installez les dépendances :**

    ```bash
    npm install
    ```

3.  **Configurez les variables d'environnement :**

    *   Créez un fichier `.env` dans le répertoire racine.
    *   Ajoutez les variables d'environnement nécessaires (voir la section Options de configuration ci-dessous).
    *   Exemple de configuration `.env` :

        ```
        DB_NAME=votre_nom_de_base_de_données
        DB_USER=votre_utilisateur_de_base_de_données
        DB_PASS=votre_mot_de_passe_de_base_de_données
        DB_HOST=localhost
        DB_PORT=3306
        MONGODB_URI=mongodb://localhost:27017/votre_nom_mongodb
        JWT_SECRET=votre_secret_jwt
        ```
4. **Lancer les conteneurs Docker :**
    ```bash
    docker compose up -d
    ```
5.  **Configuration de la base de données (MariaDB) :**

    *   Assurez-vous que le serveur MariaDB est en cours d'exécution.
    *   Créez la base de données spécifiée dans votre fichier `.env`.
    *   Exécutez les migrations de la base de données :

    ```bash
    npx sequelize-cli db:migrate
    ```

6.  **Configuration de la base de données (MongoDB) :**

    *   Assurez-vous que le serveur MongoDB est en cours d'exécution.
    *   La base de données spécifiée dans votre fichier `.env` sera automatiquement créée si elle n'existe pas.

7.  **Exécutez l'application :**

    ```bash
    npm run dev
    ```

Le serveur devrait maintenant fonctionner à l'adresse `http://localhost:3000` (ou sur le port configuré).

## Exemples d'utilisation et documentation API

### Démarrage du serveur

Le serveur peut être démarré à l'aide de la commande `npm run dev`, comme indiqué dans la section Configuration.

### Points de terminaison API (exemple) :

Consultez le répertoire `API_Bruno` pour les fichiers `.bru` contenant des exemples de requêtes API à utiliser avec Bruno IDE.


## Options de configuration

Les variables d'environnement suivantes peuvent être configurées dans le fichier `.env` :

| Variable       | Description                                       | Valeur par défaut |
| -------------- | --------------------------------------------- ---- | ------------- |
| `DB_NAME`      | Nom de la base de données MariaDB                             |               |
| `DB_USER`      | Utilisateur de la base de données MariaDB                             |               |
| `DB_PASS`      | Mot de passe de la base de données MariaDB                         |               |
| `DB_HOST`      | Hôte de la base de données MariaDB                             | `localhost`    |
| `DB_PORT`      | Port de la base de données MariaDB                             | `3306`         |
| `MONGODB_URI`  | URI de connexion MongoDB                             |               |
| `JWT_SECRET`   | Clé secrète pour le chiffrement JWT                     |               |

## Personnalisation
Pour le formatage et la lisibilité du code, vous devez utiliser Prettier
Configurer la taille des tabulations à 2