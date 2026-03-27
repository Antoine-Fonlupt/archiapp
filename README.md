# Rendu de TP TP1 et TP3

## 1. Structure du projet

### Frontend
- `index.html` : structure de la page
- `style.css` : mise en forme de l’interface
- `script.js` : logique côté client

### Backend
- `index.js` : serveur Express et routes du micro-service

---

## 2. Choix d’implémentation — Frontend

### 2.1 Structure HTML

Le fichier `index.html` contient une seule page organisée en sections sémantiques :

- un `header` avec le titre principal ;
- une section de contrôle avec :
  - un bouton de mise à jour ;
  - un bouton pour activer/désactiver le mode sombre ;
- une section de configuration du micro-service avec un champ texte pour saisir l’URL du backend ;
- une section d’affichage des messages avec une liste non ordonnée (`<ul>`) ;
- une section de publication avec :
  - un champ pseudo ;
  - un `textarea` pour le message ;
  - un bouton d’envoi.

Ce découpage suit l’esprit du TP en proposant une structure claire et logique, avec des sections bien définies pour chaque fonctionnalité. Cela passe par l'utilisation de balises HTML adaptées (`header`, `main`, `section`, `h1`, `h2`, `ul`, `button`, `textarea`), afin de rendre la page claire au vu de sa simplicité.
Cependant, dans l'hypothèse d’une application plus complexe, il serait souhaitable de rendre encore plus claire la hiérarchie des sections, par exemple en ajoutant des titres plus explicites ou en organisant les sections de manière plus visuelle, mais surtout en séparant le code en plusieurs pages ou composants.


### 2.2 Mise en forme CSS

Le fichier `style.css` ajoute une mise en forme personnalisée pour rendre l’interface plus agréable et lisible.

- un bandeau fixe en haut ;
- des cartes pour les différentes sections ;
- des boutons avec effets de survol ;
- une liste de messages visuellement séparés ;
- une gestion du **mode sombre** via une classe CSS `dark-mode` ajoutée au `body`.

### Choix esthétiques principaux
- palette claire et lisible, en accord avec les standards modernes et facilitant la lisibilité du texte (voir [Accessibilité](#4-accessibilité)) ;
- ombres et coins arrondis pour améliorer la lisibilité ;
- mise en page centrée avec largeur maximale pour rendre le contenu responsive sans utiliser une méthode trop complexe ;
- thème sombre appliqué uniquement par ajout/retrait d’une classe, ce qui évite de dupliquer la logique JavaScript.

L’objectif était d’obtenir une interface plus agréable que le mock-up minimal, tout en restant simple à ce titre, on a essayé de rendre le CSS lisible en privilégiant l'ordre du plus global au plus spécifique et en privilégiant les classes CSS aux ID pour éviter les sélecteurs trop complexes.

### 3.3 JavaScript côté client

Le fichier `script.js` remplit trois rôles :

1. répondre à la partie “petit peu de programmation” du TP ;
2. gérer dynamiquement l’affichage de la page ;
3. communiquer avec le micro-service via `fetch`.

#### a) Partie 3.1 du TP
Deux fonctions ont été codées :

- `fact(n)` : calcule la factorielle d’un entier positif ;
- `applique(f, tab)` : applique une fonction `f` à tous les éléments d’un tableau.

Des tests sont affichés dans la console :
- factorielle de 6 ;
- application de `fact` sur `[1,2,3,4,5,6]` ;
- application d’une fonction anonyme `n => n+1`.

Pour ce TP, on a choisi une implémentation itérative de la factorielle pour éviter les appels imbriqués et rendre le code plus lisible, même si une version récursive serait également possible.

La fonction `applique` a été écrite manuellement avec une boucle, afin de montrer le principe demandé par l’énoncé, sans utiliser directement `map`.


#### b) Affichage dynamique des messages
La fonction `update(messages)` :

- vide la liste existante ;
- parcourt le tableau des messages ;
- crée un `<li>` pour chaque message ;
- affiche :
  - l’auteur ;
  - la date ;
  - le contenu ;
  - un bouton de suppression.

Chaque bouton de suppression reçoit un attribut `data-index` correspondant à l’indice du message dans le tableau.
Le tableau reçu du serveur contient directement des objets de la forme :

```js
{
  text: "...",
  author: "...",
  date: "..."
}
```

Ce format est pratique car il permet d’ajouter facilement des métadonnées sans changer profondément l’affichage.

#### c) Chargement des messages

La fonction `loadMessages()` :

- lit l’URL du serveur dans le champ prévu ;
- met à jour la variable `serverBaseUrl` si nécessaire ;
- envoie une requête GET sur `/msg/getAll` ;
- récupère la réponse JSON ;
- appelle `update(data)` pour afficher les messages.

Cette fonction centralise tout le mécanisme de rafraîchissement ce qui rend le code plus modulaire et évite les redondances.
Elle est utilisée :
- au chargement initial de la page ;
- après l’envoi d’un message ;
- après la suppression d’un message ;
- lorsque l’utilisateur clique sur “Mettre à jour”.


#### d) Envoi d’un message
La fonction `postMessage()` :

- récupère le pseudo et le contenu du message ;
- utilise `"Anonymous"` si aucun pseudo n’est saisi ;
- refuse d’envoyer un message vide ;
- construit l’URL :
  `/msg/post/[message]?author=[pseudo]`
- envoie la requête ;
- recharge la liste si l’envoi réussit.

Le TP demandait un micro-service simple basé sur des routes GET.  
Même si un `POST` serait plus naturel dans une vraie application, ce choix respecte l’énoncé et simplifie les tests.

L’utilisation de `encodeURIComponent()` permet d’éviter les erreurs si le message contient des espaces des accents ou des caractères spéciaux.
C'est également un sujet de sécurité pour éviter les injections dans l’URL (même si ce n’est pas une protection idéale, l'usage de la méthode `POST` serait plus adapté pour une vraie application).


#### e) Suppression d’un message

La fonction `deleteMessage(index)` :

- appelle la route `/msg/del/[index]` ;
- recharge les messages si la suppression réussit.

La suppression par indice est la solution la plus simple avec la structure actuelle du backend.  
Cela reste cohérent avec le tableau `allMsgs` utilisé sur le serveur.


#### f) Initialisation de la page

Au chargement (`DOMContentLoaded`) :

- les événements sont attachés aux boutons ;
- le champ d’URL du serveur est pré-rempli ;
- les messages sont chargés automatiquement.

Cela évite toute action manuelle au démarrage et rend l’application immédiatement utilisable.

## 4. Accessibilité

Le site a été conçu de manière simple, lisible et globalement accessible. Même s’il ne s’agit pas d’une application auditée selon l’ensemble des critères WCAG, plusieurs choix vont dans le bon sens de l’accessibilité.

### 4.1 Utilisation de balises sémantiques

Tout d'abord le design a été pensé autour de balises HTML structurants (`header`,`main`,`section`,`h1`,`h2`,`ul`,`li`,`button`,`input`,`textarea` etc...)

Cela permet une meilleure compréhension de la structure par les technologies d’assistance et simplifie la navigation pour tous les utilisateurs en rendant plus claire la hierarchie logique du contenu (bien que le site global reste très simple, dans l'hypothèse d'un site plus complexe, il es souhaitable de rendre le plus claire possible les sections). Par exemple, les lecteurs d’écran pourront annoncer les titres et les sections de manière appropriée, ce qui facilite la compréhension de la page. Par exemple, le titre principal est porté par un `h1`, et les grandes rubriques par des `h2`, ce qui donne un ordre de lecture cohérent.


### 4.2 Utilisation de vrais éléments interactifs

Les actions principales sont réalisées avec de vrais boutons HTML, en particulier : 

- bouton de mise à jour ;
- bouton d’activation du thème sombre ;
- bouton d’envoi ;
- boutons de suppression.

C’est important pour l’accessibilité car un élément `<button>` est naturellement focusable au clavier, interprété correctement par les lecteurs d’écran et bénéficie d’un comportement standard sans recoder artificiellement l’interaction, ce qui est conformé aux bonnes pratiques d’accessibilité.

### 4.3 Lisibilité de l’interface
L’interface a été pensée pour être simple à parcourir :

- zones bien séparées par sections ;
- titres explicites ;
- boutons identifiables ;
- contrastes visuels clairs entre les différentes zones ;
- marges et espacements suffisants ;
- taille de police confortable.

Le contenu est présenté dans un format linéaire, sans disposition complexe, ce qui facilite la lecture.


### 4.4 Présence d’un mode sombre
Le bouton de bascule de thème permet à l’utilisateur de passer d’un mode clair à un mode sombre.  
Ce choix améliore le confort d’usage dans certains contextes :

- environnement peu lumineux ;
- fatigue visuelle ;
- préférence personnelle de lecture.

Le changement de thème est simple et immédiat, sans rechargement de la page.

Cependant, il est à noter que mis à part des cas très spécifiques, le mode sombre n'améliore par l'accessibilité du site, car pour des raisons de diffraction, il est préférable pour l'oeil humain d'avoir un texte sombre sur un fond clair. C'est également la raison pour laquelle le site est chargé en thème clair par défaut.

### 4.5 Compatibilité clavier
Les champs de saisie (`input`, `textarea`) et les boutons sont accessibles à la navigation clavier grâce à leur nature HTML native.

Un utilisateur peut donc atteindre les champs avec la touche Tab, y écrire son pseudo et son message et déclencher les boutons au clavier nativement.

### 4.6 Création de labels

On a introduit des labels cachés avec le CSS pour que les outils d'assistance puissent annoncer correctement les champs de saisie, même si ces labels ne sont pas visibles à l’écran.

### 4.7 Limites actuelles sur l’accessibilité
Même si le site présente déjà de bons points, certaines améliorations pourraient renforcer davantage son accessibilité :

- prévoir un texte alternatif ou un libellé plus explicite pour le bouton de suppression, au lieu de l’icône seule ;
- annoncer les mises à jour dynamiques avec une zone ARIA (`aria-live`) ;
- permettre éventuellement l’envoi du message avec la touche Entrée ou un raccourci adapté ;
- mémoriser la préférence de thème.

### Conclusion sur l’accessibilité
On peut donc justifier que le site est **accessible dans sa conception générale**, car il utilise une structure HTML sémantique, de vrais composants interactifs, une interface lisible, et une navigation clavier native.  
Il ne s’agit pas d’une accessibilité parfaite ni d’une conformité complète à toutes les normes, mais d’une base sérieuse et cohérente avec les bonnes pratiques vues dans un TP introductif.

---

## 5. Choix d’implémentation — Backend

Le backend est réalisé avec **Node.js** et **Express**.

### 5.1 Mise en place du serveur

Le serveur Express écoute sur le port `5000`.

Il contient aussi :

- un middleware CORS :
  ```js
  res.header("Access-Control-Allow-Origin", "*");
  ```
  pour permettre au frontend d’accéder au service même s’il est hébergé ailleurs ;
- `express.static('public')` pour servir des fichiers statiques si besoin.

### Pourquoi ce choix ?
Le frontend et le backend peuvent être déployés séparément.  
Le CORS est donc indispensable pour éviter le blocage des requêtes par le navigateur.

---

### 5.2 Route de test

La route :

```js
/test/*
```

renvoie un objet JSON contenant ce qui suit `/test/`.

Exemple :
```json
{ "msg": "bonjour" }
```

pour `/test/bonjour`.

Cette route sert à savoir rapidement si le serveur est up et pourrait notemment être utilisée pour une liveness probe, notamment au vu de la méthode employée pour le déploiement qui cause un délai entre la première requête et le moment où le frontend et le backend sont tous deux prêts à répondre

### 5.3 Micro-service compteur

Deux routes ont été ajoutées :

- `/cpt/query` : renvoie la valeur du compteur ;
- `/cpt/inc` : incrémente le compteur ;
- `/cpt/inc?v=XXX` : incrémente de `XXX` si `XXX` est un entier valide.

### Validation
Une expression régulière est utilisée pour vérifier que `v` est bien un entier :
```js
/^-?[0-9]+$/
```
En plus d'être une contrainte de l'énoncé, cette validation est importante pour éviter des comportements inattendus ou des erreurs côté serveur si une valeur non numérique est fournie.


### 5.4 Micro-service de messages

Les messages sont stockés dans une variable globale :

```js
var allMsgs = [
  { text: "Hello World", author: "Alice", date: new Date().toISOString() },
  ...
];
```

### Structure de donnée choisie
Chaque message est un objet contenant :

- `text` : le contenu du message ;
- `author` : le pseudo de l’auteur ;
- `date` : la date de création au format ISO.

Ce format est plus riche qu’un simple tableau de chaînes et permet notamment d’afficher les métadonnées demandées tout en restant simple à manipuler tout en restant facilement sérialisable en JSON. Cependant, le choix de ne pas implémenter de persistance de donnée cause la perte des données non hardcodées dans le backend pour son initialisation.

### 5.5 Routes implémentées

#### `/msg/nber`
Renvoie le nombre total de messages :

```json
{ "nber": 3 }
```

#### `/msg/getAll`
Renvoie tous les messages sous forme de tableau JSON.

#### `/msg/get/[index]`
Renvoie :
- `{ "code": 1, "msg": ... }` si l’indice est valide ;
- `{ "code": 0 }` sinon.

#### `/msg/post/[message]?author=xxx`
Ajoute un message avec :
- le texte récupéré dans l’URL ;
- l’auteur donné en paramètre `author`, ou `"Anonymous"` par défaut ;
- la date courante.

Renvoie :
```json
{ "code": 1, "index": ... }
```

#### `/msg/del/[index]`
Supprime le message correspondant si l’indice est valide.

Renvoie :
- `{ "code": 1 }` en cas de succès ;
- `{ "code": 0 }` sinon.

---

## 6. Choix techniques

### 6.1 Utilisation de GET pour toutes les routes
Ici toutes les routes utilisent `GET` du fait des choix techniques imposés, cependant, dans une vraie API REST, on utiliserait plutôt :

- `GET` pour lire ;
- `POST` pour créer ;
- `DELETE` pour supprimer.

### 6.2 Stockage en mémoire
Les messages sont conservés dans une variable JavaScript globale, par simplicité, cependant, commme évoqué précedement, cela cause la perte de données à chaque redémarrage (fréquent de par l'usage de render) et risque de poser un problème de race condition si deux utilisateurs venaient à supprimer le même message en même temps.

### 6.3 Suppression par indice
La suppression repose sur l’indice dans le tableau, à nouveau par simplicité, cependant, à la suppression, cela change les indices du tableau ce qui nuit à la robustesse dans un cas réel. On pourrait ajouter un identifiant à chaque message lors du stockage et se rapprocher d'une structure de données externalisable (par exemple dans une base de données SQL, ou préférablement ou vu de la légèreté de la stack, une base MongoDB)

### 6.4 Date au format ISO
La date est créée avec 

```js
new Date().toISOString()
```

ce qui permet un format standard, facilement sérialisable et directement interprétable par le navigateur. Dans notre cas, cela amène quand même un affichage peu user friendly, mais cela pourrait être corrigé assez facilement, cependant, étant donné que le format n'était pas une contrainte, on l'a laissé ainsi


## 7. Fonctionnement global

### Chargement de la page
1. Le navigateur charge `index.html`, `style.css` et `script.js`.
2. `script.js` initialise les boutons et charge les messages via `/msg/getAll`.
3. Le backend renvoie le tableau des messages.
4. Le frontend les affiche dynamiquement dans la liste.

### Publication d’un message
1. L’utilisateur saisit un pseudo et un message.
2. Le frontend appelle `/msg/post/...`.
3. Le backend ajoute le message à `allMsgs`.
4. Le frontend recharge la liste.

### Suppression d’un message
1. L’utilisateur clique sur l’icône poubelle.
2. Le frontend appelle `/msg/del/[index]`.
3. Le backend supprime l’élément du tableau.
4. Le frontend recharge la liste.

---

## 8. Déploiement

### Développement local

Le code peut être lancé en local comme suit :
- Modifier la variable `severBaseUrl`dans TP1/script.js en `http://localhost:5000`
- Lancer `docker compose up`

### Déploiement en production

L'application est visible ici : https://archiapp-front-eu30.onrender.com/.

Un délai d'initialisation peut être nécessaire le temps que les machines de render démarrent. En particulier, une erreur peut s'affichier dans le front le temps que le backend s'initialise. Il suffit d'attendre 30 à 40s pour que le site soit 100% fonctionnel.

Le backend peut être contacté ici : https://archiapp-front-eu30.onrender.com/

### Compatibilité

Le frontend est compatible avec tout backend respectant les spécifications du TP. Pour des raisons de facilité de test, un champ textuel a été ajouté dans le frontend pour modifier cette valeur en direct et tester différents backend.

