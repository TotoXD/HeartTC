# Web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Description du projet :

L’idée de notre projet web est de concevoir un jeu de cartes JcJ jouable entièrement sur navigateur et sans installation sur la machine du joueur.

## Fonctionnalités attendues :

Interface graphique
Création de compte pour chaque joueur
Combat de carte JcJ
Decks personnalisés
Ouverture de paquet de cartes
Échange de cartes entre joueurs
Possibilité de jouer contre une IA Basique qui joue “aléatoirement” (plus ou moins)
Quelques effets sonores

## Fonctionnalités avancées supplémentaires :

IA avancée effectuant les coups les plus judicieux en fonction de la difficulté de l’IA choisie (Facile/Moyenne/Difficile)
Animations
Graphismes créés par nous-même
Plus d’effets sonores

## Règle du jeu de cartes :

Deux joueurs s’affrontent lors d’un combat de cartes.
Chaque joueur possède une classe et un nombre de points de vie de 30.
Le jeu se termine lorsque les points de vie d’un joueur atteint 0 il est alors déclaré perdant.

Chaque joueur possède un deck qu’il peut personnaliser qui contient 30 cartes.
Les joueurs jouent à tour de rôle.

Les joueurs possèdent de la mana au cours de la partie, qui sera dépensée pour pouvoir jouer des cartes.
Au tour 1 les joueurs ont 1 de mana, chaque tour les joueurs regagnent tous les points de mana dépensés, et obtiennent un mana max supplémentaire, jusqu’à un maximum de 10

Les cartes sont de deux types : créatures ou sorts.

Les créatures possèdent des statistiques de points de vie et d’attaque qui lui permettront de faire face aux créatures et sorts adverses.
De plus, les créatures peuvent avoir des effets variés supplémentaires.

Les sorts quant à eux ont des effets tels que : infliger des dégâts, piocher des cartes, tuer une créature etc....
Si l’un des joueurs atteint la fin de son deck en piochant, il subira des dégâts direct à chaque fois qu’il piochera. Les dégâts augmentant de 1 à chaque pioche supplémentaire.

## Technologies utilisées :

GIT (Github dans notre cas)
MEAN :
MongoDB -> Partie base de données (compte des joueurs, decks créés…)
Express.js -> Partie Backend du site WEB et lien entre Frontend et base de données
AngularJS -> Partie Frontend du site WEB
Node.js -> Squelette liant les parties du site, Backend
