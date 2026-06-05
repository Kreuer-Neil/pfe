# Neil Kreuer - PFE 2025-2026&nbsp;: Application ComeUnite

## Comment l'installer
1. Si ce n'est pas déjà fait, installez [Composer](https://getcomposer.org/) et [Node](https://nodejs.org/en/download) sur votre machine.
2. Clonez le repo du projet sur votre machine. 
3. Lancez la commande `composer install` dans votre invite de commande, à la racine du projet.
4. Faites de même avec la commande `npm install`.
5. Lancez la commande `php artisan migrate --seed` afin de peupler le projet de données.
6. Lancez la commande `npm run dev` afin de lancer le projet en local

## Cahier des charges de ComeUnite
Projets communautaires collaboratifs (et donc gestion de ceux-ci)
Un outil pour coordonner des projets locaux ou communautaires, avec des fonctionnalités de collaboration et de suivi des progrès.

### Contexte et Objectif

L'application vise à faciliter la communication et l’organisation de projets communautaires. Elle permettra aux utilisateurs de créer, suivre et collaborer sur des projets, tout en favorisant l’engagement communautaire.

L’objectif serait donc d’aider les petites communautés, de leur permettre de proposer leurs projets et d’y faire participer les personnes volontaires, afin d'améliorer l'espace de vie commun et/ou le bien-être des membres d'une communauté. Que cette dernière soit une rue, un quartier, ou même toute une ville. Et ce, que ce projet soit une invitation aux habitants à installer des nichoirs à oiseaux, abris pour hérissons, ou autres dispositifs pour animaux sauvages, pousser la ville à autoriser la plantation de fleurs et d’arbres au sein de cette dernière afin de la rendre plus verte et chaleureuse, un potager partagé pour faire des économies sur les fruits et légumes, et bien d’autres encore.


### Fonctionnalités Principales
(sont également listées dans le [fichier Figma](https://www.figma.com/design/FKS2nRA0CgPv6EcUjuYYSG/PFE-%22Come-Unite%22?node-id=0-1&t=YRbJmTLryWjCQc7z-1))

1. **Inscription et Authentification**
   * **Création de compte&nbsp;:** Les utilisateurs peuvent s’inscrire avec une adresse e-mail et un mot de passe.
   * **Abonnement à la gestion de projets&nbsp;:** Seules les personnes habilitées ou ayant payé pourront créer un projet (afin de modérer facilement ces projets).
   * **Profil utilisateur&nbsp;:** Chaque utilisateur possède un profil sur lequel il peut afficher (ou non) quelques informations personnelles.
2. **Gestion des Projets**
    * **Création de projet&nbsp;:** Les utilisateurs peuvent créer des projets en spécifiant le titre ainsi qu'une description des objectifs. Mais comme dit plus haut, elles devront souscrire un abonnement afin d'y participer. 
    * **Recherche de projets&nbsp;:** Les utilisateurs peuvent chercher des projets parmi ceux qui sont publics, en s’aidant de tags pour le thème et d’une barre de recherches pour le nom. Ils pourront également les filtrer par distance et nombre de participants.
    * **Suivi des progrès&nbsp;:** Les utilisateurs peuvent mettre à jour l’état d’avancement du projet à travers des posts de type "news".
    * **Gestion des tâches&nbsp;:** Possibilité de créer des tâches associées à chaque projet, avec des personnes s’y assignant, et les des délais si nécessaires.
3. **Collaboration**
    * **Équipes de projets&nbsp;:** Les utilisateurs peuvent inviter d’autres membres à rejoindre un projet, ou les rendre publics (pour un lieu donné ou non).
    * **Localisation&nbsp;:** Les utilisateurs peuvent également rejoindre un projet qui leur sera affiché selon leur proximité avec celui-ci, si c’est par exemple un projet proposé par la ville, ou par les habitants d’un même immeuble d’appartements, ou encore d’un quartier. Ex: Potager commun sur le toit de l’immeuble, surveillance de quartier, embellir le parc en s’occupant des fleurs, etc.
    * **Messagerie intégrée&nbsp;:** Un système de messagerie pour faciliter la communication entre les membres du projet.
    * **Partage de documents&nbsp;:** Les utilisateurs peuvent télécharger et partager des fichiers pertinents pour le projet.
4. **Liste des tâches**
    * **Calendrier des tâches&nbsp;:** Un calendrier reprenant les tâches et permettant d'avoir une vue par jour et par semaine des tâches à venir.
5. **Notifications**
    * **Alertes et rappels&nbsp;:** Notifications par e-mail et dans l’application pour les news de projets, les échéances de tâches et les messages.
    * **Ne pas la rendre trop intrusive&nbsp;:** Éviter de créer des notifications donnant l’impression d’agresser les gens et les forcer à participer aux projets si ils ne sont pas inscrits à une tâche.
    * **Paramètres de notifications&nbsp;:** Permettre aux utilisateurs de décider quelles alertes il reçoivent ou non, et si ils souhaitent avoir les notifications par mail.
