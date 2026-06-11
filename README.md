# Neil Kreuer - PFE 2025-2026&nbsp;: Application ComeUnite

## Liens externes
* [Site de documentation technique](https://github.com/Kreuer-Neil/neil-kreuer-doc-PFE/deployments/github-pages)
* [Fichier Figma](https://www.figma.com/design/FKS2nRA0CgPv6EcUjuYYSG/PFE-%22Come-Unite%22?node-id=1839-27476&t=430owWGHzpv4bQ0c-1)

## Comment l’installer
1. Si ce n’est pas déjà fait, installez [Composer](https://getcomposer.org/) et [Node](https://nodejs.org/en/download) sur votre machine.
2. Clonez le repo du projet sur votre machine. 
3. Lancez la commande `composer install` dans votre invite de commande, à la racine du projet.
4. Faites de même avec la commande `npm install`.
5. Lancez la commande `php artisan migrate --seed` afin de peupler le projet de données.
6. Lancez la commande `npm run dev` afin de lancer le projet en local

## Cahier des charges de ComeUnite
Projets communautaires collaboratifs (et donc gestion de ceux-ci)
Un outil pour coordonner des projets locaux et communautaires, avec des fonctionnalités de collaboration et de suivi des progrès.

### Contexte et Objectif

L’application vise à faciliter la communication et l’organisation de projets communautaires. Elle permettra aux utilisateurs de créer, suivre et collaborer sur des projets, tout en favorisant l’engagement communautaire.

L’objectif serait donc d’aider les petites communautés, de leur permettre de proposer leurs projets et d’y faire participer les personnes volontaires, afin d’améliorer l’espace de vie commun et/ou le bien-être des membres d’une communauté. Que cette dernière soit une rue, un quartier, ou même toute une ville. Et ce, que ce projet soit une invitation aux habitants à installer des nichoirs à oiseaux, abris pour hérissons, ou autres dispositifs pour animaux sauvages, pousser la ville à autoriser la plantation de fleurs et d’arbres au sein de cette dernière afin de la rendre plus verte et chaleureuse, un potager partagé pour faire des économies sur les fruits et légumes, et bien d’autres encore.


### Personas

Persona 1
- Nom : Jeanne Rainbow
- Âge : 27 ans
- Emploi : Employée de supermarché
- Passions : Sport (jogging), protection de la nature
- Milieu socio-économique : Modeste, employée de supermarché
- **Comportement&nbsp;:**
  - Aise avec la technologie : Relativement à l’aise, s’en sert tous les jours et joue souvent à des jeux mobiles tels que Candy Crush, Nongram, etc. 
  - Cherche à faire quelque chose qui donnerait un peu plus de sens à sa vie que son travail 
  - Relation avec ComeUnite : En avait entendu parler juste de nom par du bouche à oreilles, retombe dessus pendant sa recherche pour des activités proche de chez elle, cherchant potentiellement quelque chose en lien avec la protection des animaux ou des plantes afin de se sentir revalorisée en faisant le bien (mots-clés : “activités”, “proche”, “nature”)
  - Rejoint ComeUnite en recherche d’un projet qui la motiverait vers chez elle, espérant que la promesse de “projets proche de chez vous” sera respectée
- Parcours utilisateur 
  - Se sert de l’app pour rejoindre un petit projet dans son quartier dont l’objectif est de l’embellir en plantant des fleurs et arbres là où c’est autorisé, faisant signer des pétitions pour faire pression sur la ville et obtenir les autorisations.


Persona 2
- Nom : Saddie Miller
- Âge : 72 ans
- Emploi : Retraitée, ex-rockstar
- Passions : Jardiner, se promener dans le parc de la ville, discuter
- Milieu socio-économique : Dans la moyenne, retraite suffisante pour vivre dans un appartement en ville, retraitée
- Comportement
  - Aise avec la technologie : Très faible, sait juste appeler avec son smartphone. 
  - Souhaite s’organiser avec d’autres personnes de son quartier pour embellir le parc, mais a besoin d’aide pour ça. 
  - Demande à son petit-fils qui s’y connaît en technologie de l’aider, qui la redirige vers l’application ComeUnite qu’il trouve en cherchant, et l’aide à créer son compte ainsi que comprendre les bases pour la faire fonctionner.
- Parcours utilisateur 
  - En cherchant dans les projets à proximité, elle découvre un projet axé sur l’embellissement de la ville, et décide de le rejoindre. Elle découvre qu’un petit groupe de gens se réunit toutes les deux semaines pour discuter de ce projet, et participe à la prochaine réunion. 
  - Après avoir accepté une tâche, elle appuie sur participer, et l’ajoute à son calendrier pour ne pas oublier.
  - Seulement, la ville a décidé de s’en occuper elle-même, ce qui fait que la tâche tombe à l’eau. Saddie reçoit alors une notification sur son smartphone, par mail et via l’application, afin de la prévenir de l’annulation.


Persona 3
- Papy bricoleur 
- Nom : Larry VonFlughaven 
- Âge : 68 ans 
- Emploi : Retraité, anciennement propriétaire d’un magasin de fournitures 
- Passions : Travailler, le bricolage, etc. 
- Milieu socio-économique : Bonne retraite, vit dans une maison avec sa femme, a même un petit atelier.
- Comportement 
  - Aise avec la technologie : Assez faible, téléphone à clapet, n’utilisait l’ordinateur que pour regarder des vidéos de bricolage, ou pour gérer les commandes mais laissait généralement un employé les encoder 
  - N’est pas satisfait d’avoir complètement arrêté le travail et souhaite encore faire quelque chose de ses mains 
  - Ne connait pas ComeUnite, se fait inviter dans un projet par une ornithologue de son quartier qui venait régulièrement dans son magasin en la rencontrant par hasard 
- Parcours utilisateur 
  - Passe pas mal de temps à essayer de comprendre l’interface et à lire les tutoriels intégrés afin de comprendre comment utiliser l’application sur son ordinateur personnel 
  - Se fait aider par sa connaissance et trouve les tâches de bricolage de nichoirs à oiseaux associées au projet. Clique sur “participer” et se met à les fabriquer, en suivant le plan qu’on lui a montré dans l’onglet de ressources. Une fois qu’il a fini, il marque sur la tâche le nombre de nichoirs qu’il lui reste, et en donne à quelques membres du projet qui passent les chercher, attendant avec impatience la prochaine tâche de bricolage à laquelle il pourrait s’atteler.


Persona 4
- Nom : Phil Milstein 
- Âge : 45 ans 
- Emploi : Architecte d’intérieur 
- Passions : Décoration, vélo, promenades 
- Milieu socio-économique : Aisé, propriétaire d’une maison en banlieue, revenus confortables
- Comportement 
  - Aise avec la technologie : Relativement à l’aise, travaille avec la technologie 
  - Souhaite profiter un peu de son temps libre pour faire quelque chose d’un peu altruiste ne demandant que de son temps, mais ne sait pas vers où se tourner 
  - Relation face à ComeUnite: Ne connaissait pas l’application, n’en a jamais entendu parler. Découvre qu’un projet souhaite embellir les rues de sa ville sur l’app ComeUnite via une affiche dans la rue avec un code, et essaie de l’utiliser pour en savoir plus, avant de finalement créer un compte pour essayer 
- Parcours utilisateur 
  - Décide de prendre part au projet de décoration en proposant son expertise, gérant lui-même sa présence afin de ne pas y passer tout son temps libre ni laisser le projet empiéter sur son travail.


Persona 5
- Nom : Henrietta Stickpin 
- Âge : 52 ans 
- Emploi : inspectrice sanitaire pour une chaîne de restauration aux US 
- Passions : Marche, lecture 
- Milieu socio-économique : Classe moyenne (moyenne-haute), revenus confortables 
- Comportement 
  - Aise avec la technologie : Utilise couramment son smartphone et son PC pour le travail, relativement à l’aise avec les applications etc. 
  - Souhaite donner de son temps pour une cause qui lui tient à coeur, et utilise ComeUnite depuis un moment, pour un projet avec quelques collègues et connaissances. 
  - Doit souvent partir à l’étranger pendant de longues périodes pour son travail et ne peut donc pas proposer sa présence chaque semaine 
- Parcours utilisateur 
  - Se sert régulièrement du bouton “Se mettre absent” afin de préciser son incapacité à participer aux tâches. Seules les personnes partageant le projet seront au courant, ainsi moins de risques de devenir une cible facile de cambriolage à cause de fuites d’informations de la part de l’app.



### Scénarios types

#### Potager partagé d’un immeuble d’appartements.
Vous habitez dans un appartement, dans un immeuble muni d’un petit jardin. Ce jardin, il appartient à tout le monde, mais vous voulez le rendre utile, et pas juste pour le barbecue. Ainsi, vous contactez les autres habitants, et leur proposez votre projet : Installer un potager dans ce jardin. Le propriétaire est d’accord, et ainsi vous commencez le projet. Mais le problème, c’est l’organisation. Parfois, vous êtes deux pour creuser, parfois vous êtes cinq à acheter les graines.

Vous cherchez rapidement des tips sur l’organisation de ce genre, et vous tombez sur une application. Come Unite. Un nom étrange, mais le concept pourrait correspondre à l’aide organisationnelle nécessaire. En plus, le premier mois de gestion de projet est gratuit.

L’organisation devient plus simple : Il faut acheter des cisailles ? C’est rajouté sur la liste, et quiconque souhaite s’en occuper s’y assigne et va la chercher ensuite. Étant assigné, les  autres personnes découvrant qu’il est nécessaire d’acheter des cisailles sauront que quelqu’un s’en occupe déjà, plus pratique qu’un papier épinglé sur un panneau à l’entrée. Et puis, si il y a besoin de parler du partage du coût des cisailles, on peut passer sur WhatsApp ou signal, mais il y a un chat intégré, alors pourquoi ne pas s’en servir ? Il est limité, mais fonctionnel.

Mais il faut aussi arracher les mauvaises herbes, et pour y aller plus vite, l’idéal est d’être à trois : Deux personnes qui les arrachent, et une qui les récupère pour les jeter. La tâche est ajoutée, les trois personnes s’arrangent entre elles pour quand le faire en mettant leurs disponibilités en notes de la tâche, et via le chat, et bientôt elles se retrouvent et accomplissent la tâche. Une fois que c’est fait, l’un d’eux n’a qu’à marquer la tâche comme accomplie.

Une question qui revient sans cesse est de faire un plan des différent plants du potager, afin de savoir ce qui devrait sortir à quel endroit. Le plan est fait, sur papier ou support numérique, et le voilà qu’il apparaît dans l’onglet de ressources du projet. Tout le monde peut y avoir accès en un instant maintenant, et même l’imprimer si ils le souhaitent.
Enfin, après tout ce temps à tout faire pousser, vient le moment des récoltes. Alors, pourquoi ne pas organiser un Barbecue ? Un sondage est fait pour décider de la date, et à l’exception de la récolte, une dernière tâche est ajoutée. Pas un tâche en fait, un événement : “Barbecue avec les récoltes”. Tout le monde y met du sien, et après le Barbecue, le reste se partage entre eux de manière équitable, et le potager reprend.

En hiver, le potager prend une pause. Mais payer l’abonnement chaque mois pour ne pas utiliser l’application, c’est quand même un peu fort. Et si on ne paie pas un mois, l’application menace de supprimer entièrement le projet. Heureusement, dans l’onglet des abonnements, il est possible de “geler” le projet. Plus personne ne pourra le consulter pendant quelques mois, jusqu’à ce que le gérant du projet ne le remette en ligne. Le coût de maintien du projet se voit fortement diminuer, car plus aucune requête ne le demande.



#### Oiseaux et autres animaux au printemps

Le printemps, c’est le retour de la vie, de la nature, après une longue période de froid. Les oiseaux mettent fin à leur migration, tandis que certains rongeurs et autres petits animaux terrestres sortent de leur hibernation. Mais dans les villes et villages, où le monde a été colonisé par les humains, il ne reste plus tellement d’endroits où s’abriter, ni se nourrir. Ainsi naît le projet d’installer des nichoirs en tout genre, distributeurs de graines, abris pour hérissons, etc.

Le but de ce projet est de partager l’envie et les conseils sur la nourriture et l’installation de nichoirs et autres pour les oiseaux ! Seulement, voilà : Vous n’êtes que trois en ce début de projet, et à trois le projet n’ira pas très loin. Vous décidez donc de rendre le projet public, et là plusieurs membres font leur apparition !

Dans le lot des nouveaux membres, il y a différents profils : Les intéressés, qui participent à certaines tâches de temps en temps; Les passionnés, qui souvent proposent des choses et semblent prendre l’aide des animaux très à cœur; Et les trouble-fêtes, qui participent et se retirent à la dernière seconde, et envoient n’importe-quoi sur le canal de discussion. Ce serait bien de faire quelque chose, pas vrai ?

Pour les utilisateurs impliqués, vous leur donnez le rôle “maître des tâches”, qui leur permet de créer et gérer les tâches, et leur donne un peu plus de contrôle. Comme ça, ils pourront le faire eux-mêmes au lieu de passer par vous à chaque fois ! Ce qui ne les dispense pas de discuter sur le projet.

Et les deux personnes avec qui vous avez commencé ? Modérateurs, pouvant promouvoir les simples utilisateurs en “maître des tâches” et expulser les membres indésirables.

Et les trouble-fêtes ? Vous cliquez sur leur profil, et un petit drapeau vous intrigue. Vous cliquez dessus, et une modale apparaît, vous demandant ce pour quoi vous tenez à signaler l’utilisateur. Vous indiquez les raisons, et puis l’expulsez du projet.
Vous ajoutez une tâche cruciale : Trouver quelqu’un qui puisse vous faire des prospectus. Une manière de condenser et de rendre plus illustrée les conseils rassemblés par les membres du groupe. Par chance, un de vos membres propose ses services à prix réduit, et sait même où faire imprimer des prospectus ! Il en parle dans le salon de discussion, et vous vous cotisez pour payer ces frais.

Vos prospectus sont là ! Tout beaux, tout propres, et prêts à être distribués ! La tâche de les glisser dans quelques boîtes aux lettres de maisons avec jardin se voit rajoutée, précédée d’une réunion pour les partager.

Cependant, l’horaire de la réunion pose problème, étant donné que certaines des personnes assez impliquées ne sont pas toujours disponibles. Et en parler dans le groupe de discussion n’est pas chose aisée, pour les mêmes raisons. C’est là que vous vous rappelez qu’il existe une feature de sondages, avec laquelle vous pouvez proposer plusieurs dates avant de vous fixer sur celle de la réunion, qui peut même être créée en tant que tâche afin d’apparaître dans l’agenda.

Certaines personnes n’ont pas eu l’occasion de les recevoir, et n’ont pas pu obtenir la version papier. Mais grâce à la section Ressources du projet, ils peuvent les imprimer eux-mêmes si ils en ont l’occasion, ou consulter la version digitale qui y a été postée !

Mais voilà, l’automne est tombée, et l’hiver se profile à l’horizon. La plupart des oiseaux migratoires ont déjà entamé leur vol vers le sud, les hérissons et autres petits herbivores ont entamé leur hibernation, et le projet n’est plus très utile en ce moment. Mais ça donne lieu à un problème : Que faire du projet ? Le garder pendant ces 3 à 4 mois où il ne sera pas utile, mais coûte de l’argent ? Ou bien le supprimer et perdre les différentes tâches qui sont déjà prêtes et devront être refaites en cas de suppression, sans oublier qu’il va falloir réinviter tout le monde et remettre les paramètres. Le supprimer semble mieux et moins cher, mais alors que vous décidez de le faire, une alternative apparaît à l’écran : Le projet lui-même peut également entrer en hibernation ! Plus besoin de payer, les données restent enregistrées, mais inaccessibles à moins de reprendre un abonnement et réactiver le projet. Il y a cependant un avertissement, disant que le projet ne peut rester en hibernation plus d’un an. Ce n’est évidemment pas un problème, car il reprendra du service dès le mois de janvier, afin de préparer le retour de la vie !


#### Embellir le parc de la ville
Le parc de la ville n’a jamais été très vivant. La seule chose dont la ville s’occupe, c’est de couper l’herbe et les branches d’arbres quand il faut, mais ce n’est pas suffisant pour un beau parc. Ils ont planté des fleurs, mais personne ne s’en occupe, et elles sont en train de faner. Il est temps de faire quelque chose.

Après avoir créé votre compte sur ComeUnite, vous créez votre projet avec l’abonnement gratuit, histoire d’essayer. Votre objectif, réunir des gens partageant votre envie de ramener de la couleur dans ce parc. Vous l’indiquez même dans la description.

Vous commencez à venir dans le parc et y semer des graines de fleurs. Au bout de quelques jours, le premier membre apparaît dans le projet, et demande à discuter du projet, étant intéressé par la description qu’il en a lue. Rapidement, avec quelques discussions, la manière d’aborder le projet prend une tournure plus intéressante, étant donné que la présence d’un groupe permet d’avoir l’attention de l’administration de la ville, qui les autorise finalement à effectuer certaines tâches dans le parc, à leurs frais. Les nouvelles tâches se mettent à différer des premières, et se composent entre autres de manifestations et de passages à la mairie.

Et au fil du temps, votre projet devient plus large&nbsp;: vous ne souhaitez plus juste embellir le parc, mais redonner des couleurs à la ville. Vous créez des pétitions, que les membres du projet vont faire signer par leurs proches ou en faisant du porte-à-porte afin d’obtenir les autorisations de planter des fleurs et des arbres, et redonner une teinte de vie à cette ville de bitûme. Mais le parc n’est plus votre seule préoccupation, alors vous mettez à jour la description du projet, et écrivez une news pour laisser aux utilisateurs une mise à jour sur l’évolution du projet.


### Fonctionnalités prévues
(sont également listées dans le [fichier Figma](https://www.figma.com/design/FKS2nRA0CgPv6EcUjuYYSG/PFE-%22Come-Unite%22?node-id=0-1&t=YRbJmTLryWjCQc7z-1))

1. **Inscription et Authentification**
   * **Création de compte&nbsp;:** Les utilisateurs peuvent s’inscrire avec une adresse e-mail et un mot de passe.
   * **Abonnement à la gestion de projets&nbsp;:** Seules les personnes habilitées ou ayant payé pourront créer un projet (afin de modérer facilement ces projets).
   * **Profil utilisateur&nbsp;:** Chaque utilisateur possède un profil sur lequel il peut afficher (ou non) quelques informations personnelles.
2. **Gestion des Projets**
    * **Création de projet&nbsp;:** Les utilisateurs peuvent créer des projets en spécifiant le titre ainsi qu’une description des objectifs. Mais comme dit plus haut, elles devront souscrire un abonnement afin d’y participer. 
    * **Recherche de projets&nbsp;:** Les utilisateurs peuvent chercher des projets parmi ceux qui sont publics, en s’aidant de tags pour le thème et d’une barre de recherches pour le nom. Ils pourront également les filtrer par distance et nombre de participants.
    * **Suivi des progrès&nbsp;:** Les utilisateurs peuvent mettre à jour l’état d’avancement du projet à travers des posts de type "news".
    * **Gestion des tâches&nbsp;:** Possibilité de créer des tâches associées à chaque projet, avec des personnes s’y assignant, et les des délais si nécessaires. Possibilité de les supprimer pour les modérateurs du projet.
3. **Tâches**
   * **Participations&nbsp;:** Les utilisateurs auront le droit de participer à toutes les tâches des projets rejoints qu’ils souhaitent. Ils pourront voir en temps réel le nombre de participants actuels, comparé au nombre de participants recommandés établis par la personne ayant mis en place la tâche.
   * **Notes&nbsp;:** Les utilisateurs pourront laisser une note sous les tâches afin de partager des conseils ou d’apporter des précisions oubliées par la personne à l’origine de la note.
   * **Avertissements&nbsp;:** Les utilisateurs recevront un avertissement par mail et dans l’app lorsqu’une tâche arrive bientôt à échéance et qu’ils ne l’ont pas encore validée.
4. **Collaboration**
    * **Équipes de projets&nbsp;:** Les utilisateurs peuvent inviter d’autres membres à rejoindre un projet, ou les rendre publics afin qu’ils soient trouvable par les utilisateurs de l’application.
    * **Localisation&nbsp;:** Les utilisateurs peuvent également rejoindre un projet qui leur sera affiché selon leur proximité avec celui-ci, si c’est par exemple un projet proposé par la ville, ou par les habitants d’un même immeuble d’appartements, ou encore d’un quartier. Ex: Potager commun sur le toit de l’immeuble, surveillance de quartier, embellir le parc en s’occupant des fleurs, etc.
    * **Messagerie intégrée&nbsp;:** Un système de messagerie pour faciliter la communication entre les membres du projet.
    * **Partage de documents&nbsp;:** Les utilisateurs peuvent télécharger et partager des fichiers pertinents pour le projet.
5. **Liste des tâches**
    * **Calendrier des tâches&nbsp;:** Un calendrier reprenant les tâches et permettant d’avoir une vue par jour et par semaine des tâches à venir.
6. **Notifications**
    * **Alertes et rappels&nbsp;:** Notifications par e-mail et dans l’application pour les news de projets, les échéances de tâches et les messages.
    * **Ne pas la rendre trop intrusive&nbsp;:** Éviter de créer des notifications donnant l’impression d’agresser les gens et les forcer à participer aux projets si ils ne sont pas inscrits à une tâche.
    * **Paramètres de notifications&nbsp;:** Permettre aux utilisateurs de décider quelles alertes il reçoivent ou non, et si ils souhaitent avoir les notifications par mail.
