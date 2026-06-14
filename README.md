# 🛒 TP Mini Plateforme E-Commerce (Frontend Mocké)

Bienvenue dans ce projet de **Boutique E-Commerce 100% Client-Side** conçu pour être à la fois un travail technique finalisé de niveau professionnel et un **support pédagogique détaillé pour débutant**.

> 💡 **Information importante sur le choix technique :**
> L'environnement de ce sandbox est pré-configuré avec **React v19** + **Vite** + **Tailwind CSS**. Pour respecter ces contraintes tout en favorisant votre apprentissage et votre désir d'apprendre **VueJS**, ce guide et le code source contiennent des **analogies croisées systématiques**. Vous découvrirez qu'entre React et VueJS, les concepts fondamentaux sont identiques !

---

## 🚀 Concept Général : Comment fonctionne notre Boutique ?

L'application simule le fonctionnement complet d'une boutique haut de gamme :
1. **Catalogue dynamique :** Un tableau de produits fictifs avec filtres par catégorie, recherche globale floue par mot-clé et tri par prix.
2. **Page de détails :** Sélection d'un article, changement de l'image via galerie interactive, et statut des stocks réels.
3. **Gestion du panier :** Ajout d'articles réactifs avec calculs automatiques des sous-totaux, seuil de livraison offerte (+50€), et protection contre les ruptures de stock.
4. **Sauvegarde des coups de cœur (Wishlist) :** Les articles favoris sont conservés d'une session à l'autre.
5. **Persistance locale :** Sauvegarde automatique du panier et des favoris dans le navigateur via `localStorage`.
6. **Tunnel de Commande (Checkout) :** Formulaire de saisie d'informations, vérification des erreurs de saisie en temps réel, écran de "simulation d'autorisation bancaire" et confirmation de commande.
7. **UX Soignée :** Micro-interactions avec la librairie d'animation `motion`, boutons réactifs, et **Skeleton Loading** (squelette d'attente animé) lorsque l'on manipule la boutique.

---

## 🛠️ Explications pour Débutant : Les Technologies Utilisées

### 1. Vite (Le serveur de développement)
* **C'est quoi ?** C'est l'outil qui prépare le code pour le navigateur en un éclair. Il a été créé par **Evan You** (qui est aussi le créateur de **VueJS** !). 
* **Pourquoi ?** Il recharge instantanément l'écran quand on modifie un fichier (Hot Module Replacement) et compile très rapidement notre code Typescript.

### 2. React (VS VueJS)
* **C'est quoi ?** Une bibliothèque pour créer des interfaces utilisateurs à partir de composants autonomes.
* **Le point clé :** En React ou VueJS, notre écran est un assemblage d'éléments visuels réutilisables (composants). L'interface s'aligne automatiquement dès que les données internes changent (c'est la *réactivité*).

### 3. Tailwind CSS
* **C'est quoi ?** Un cadriciel CSS utilitaire. Au lieu d'écrire du code CSS dans des fichiers séparés fatigants à maintenir, on applique des classes prêtes à l'emploi (ex: `bg-indigo-600` pour un fond bleu-indigo, `rounded-xl` pour des angles arrondis, `p-4` pour de l'espacement).
* **Le point clé :** Les styles s'écrivent directement dans le code du composant, rendant les layouts faciles à ajuster.

### 4. TypeScript
* **C'est quoi ?** Un "sur-ensemble" de JavaScript qui ajoute des types de données.
* **Pourquoi pour un débutant ?** Il vous empêche de faire des erreurs d'inattention. Si vous définissez qu'un produit possède un prix sous forme de nombre (`price: number`), TypeScript lèvera une alerte immédiate si vous tentez par mégarde d'écrire du texte à la place.

---

## 📖 Équivalent React ↔️ VueJS (Guide de Survie)

Pour chaque outil utilisé dans ce TP, voici comment l'écrire si vous deviez migrer le projet sous **VueJS (avec l'API de Composition `<script setup lang="ts">`)** :

| Concept | Écriture en React (Utilisée ici) | Équivalent direct en VueJS 3 |
| :--- | :--- | :--- |
| **Composant fonctionnel** | `export default function App() { ... }` | Fichier `.vue` avec `<template>` et `<script setup>` |
| **État réactif (State)** | `const [count, setCount] = useState(0);` | `const count = ref(0);` *(on modifie via `count.value++`)* |
| **Effets / Observateurs** | `useEffect(() => { ... }, [count]);` | `watch(count, (newVal) => { ... })` ou `onMounted(() => { ... })` |
| **Champs calculés** | `const total = subtotal + 4.90;` *(calcul à chaque rendu)* | `const total = computed(() => subtotal.value + 4.90)` |
| **Rendu conditionnel** | `{isOutOfStock && <Badge />}` | `<Badge v-if="isOutOfStock" />` |
| **Boucle sur liste** | `products.map(p => <Card key={p.id} />)` | `<Card v-for="p in products" :key="p.id" />` |
| **Liaison Formulaire** | `value={name} onChange={e => setName(e.target.value)}` | `v-model="name"` |
| **Classes dynamiques** | `` className={`px-4 border ${active ? 'bg-blue-500' : ''}`} `` | `:class="['px-4', 'border', { 'bg-blue-500': active }]"` |
| **Évènements au clic** | `onClick={handleSelect}` | `@click="handleSelect"` ou `v-on:click="handleSelect"` |
| **Arrêt propagation** | `onClick={(e) => e.stopPropagation()}` | `@click.stop="handleSelect"` |

---

## 📂 Architecture Précise du Projet

Le projet adopte une structure modulaire, claire et maintenable :

```bash
├── /src
│   ├── /components                     # Sous-composants graphiques réutilisables
│   │   ├── Header.tsx                  # Navbar, recherche, filtres actifs, compteurs panier/favoris
│   │   ├── ProductCard.tsx             # Carte produit individuelle optimisée (badges, notes, favoris, prix)
│   │   ├── ProductDetails.tsx          # Fiche complète, carrousel photo, stock restant, avis
│   │   ├── Cart.tsx                    # Menu de panier défilant (gestion des quantités, offre de livraison)
│   │   ├── Wishlist.tsx                # Page des produits mis en coup de cœur
│   │   ├── Checkout.tsx                # Formulaire de commande, simulation de soumission / confirmation
│   │   └── Loader.tsx                  # "Squelettes" (Skeletons) animés pour les temps de chargement
│   ├── App.tsx                         # Orchestrateur central de l'application (gère l'état et localstorage)
│   ├── data.ts                         # Base de données mockée de nos 8 produits qualitatifs
│   ├── types.ts                        # Définition des interfaces Typescript de données
│   ├── index.css                       # Fichier CSS global important Tailwind CSS
│   └── main.tsx                        # Point d'entrée de notre application React
├── index.html                          # Squelette HTML d'entrée
├── package.json                        # Dépendances et scripts de l'application
└── tsconfig.json                       # Paramétrage de TypeScript
```

---

## 🛠️ Instructions d'Installation pour Votre Machine

Si vous souhaitez récupérer ce projet pour le faire tourner sur votre ordinateur en local, suivez ces quelques étapes :

1. **Assurez-vous d'avoir installé [Node.js](https://nodejs.org/)** (recommandé v18+).
2. **Installez les dépendances nécessaires** :
   ```bash
   npm install
   ```
3. **Lancez le serveur de développement local** :
   ```bash
   npm run dev
   ```
4. **Ouvrez votre navigateur** à l'adresse indiquée, généralement : [http://localhost:3000](http://localhost:3000).
5. **Pour générer la build de production compilée** :
   ```bash
   npm run build
   ```

---

## 💡 Choix Techniques Expliqués

* **Données Centralisées dans App.tsx :** Nous faisons remonter l'état du panier et des favoris dans `App.tsx`. Ainsi, le panier (`Cart.tsx`), l’en-tête (`Header.tsx`) et les fiches produits s'accordent en temps réel sans conflit.
* **Comportement Réaliste des Stocks :** Lorsque vous finalisez une commande fictive dans l'écran de checkout, notre panier se vide, et nous déduisons de façon dynamique les quantités achetées au niveau des stocks disponibles dans l'état de l'application.
* **Transitions Polies :** Avec la librairie `motion` intégrée de manière subtile, le panier glisse de la droite, et les badges s'animent doucement lorsqu'ils s'incrémentent.
* **Erreurs Gérées de Bout en Bout :** L'interface empêche l'ajout au panier d'articles épuisés (comme la *Cafetière Express* mise à 0 stock pour tester l'exercice) et refuse les informations incorrectes dans le formulaire de livraison.
