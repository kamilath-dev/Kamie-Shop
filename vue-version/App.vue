<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { MOCK_PRODUCTS } from './data';
import { Category, Product, CartItem, Order } from './types';

// Importations automatiques de tous nos superbes sous-composants !
import Header from './components/Header.vue';
import Loader from './components/Loader.vue';
import Catalog from './components/Catalog.vue';
import ProductDetails from './components/ProductDetails.vue';
import Cart from './components/Cart.vue';
import Wishlist from './components/Wishlist.vue';
import Checkout from './components/Checkout.vue';
import WhatsAppChat from './components/WhatsAppChat.vue';

// ETAT RÉACTIF GENERAL (Comme les variables d'États useState de React !)
const searchTerm = ref('');
const selectedCategory = ref<Category>('Tous');
const sortBy = ref<string>('default'); // Critère de tri actif (pertinence, prix croissant, prix décroissant, note)
const cart = ref<CartItem[]>([]);
const favorites = ref<string[]>([]); // Liste d'IDs de produits favoris
const activeTab = ref<'catalog' | 'wishlist'>('catalog');
const selectedProduct = ref<Product | null>(null);
const isCartOpen = ref(false);
const activeScreen = ref<'catalog' | 'checkout'>('catalog');
const isLoading = ref(true);

// CATEGORIES DISPONIBLES
const categories: Category[] = ['Tous', 'Électronique', 'Mode', 'Maison & Déco', 'Livres & Papeterie'];

// CHARGEMENT DE LOCALSTORAGE (Cycle de vie monté)
onMounted(() => {
  // 1. Chargement panier
  const savedCart = localStorage.getItem('ecoshop-cart');
  if (savedCart) {
    try { cart.value = JSON.parse(savedCart); } catch (e) { cart.value = []; }
  }

  // 2. Chargement favoris
  const savedFavorites = localStorage.getItem('ecoshop-favorites');
  if (savedFavorites) {
    try { favorites.value = JSON.parse(savedFavorites); } catch (e) { favorites.value = []; }
  }

  // 3. Simulation de vitesse réseau (chargement visuel de 1,2 seconde)
  setTimeout(() => {
    isLoading.value = false;
  }, 1200);
});

// WATCHERS DE SAUVEGARDE AUTOMATIQUE (Dès que la variable change, on synchronise avec localStorage !)
watch(cart, (newCart) => {
  localStorage.setItem('ecoshop-cart', JSON.stringify(newCart));
}, { deep: true }); // "deep: true" permet de plonger dans l'arbre pour détecter le changement de quantité

watch(favorites, (newFavorites) => {
  localStorage.setItem('ecoshop-favorites', JSON.stringify(newFavorites));
}, { deep: true });


// CALCULS DE FILTRATIONS DÉCORATIVES (Computed)
// Filtre les produits du catalogue selon les critères de catégorie, barre de recherche & tri
const filteredProducts = computed(() => {
  const products = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory.value === 'Tous' || product.category === selectedCategory.value;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                          product.shortDescription.toLowerCase().includes(searchTerm.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Tri des produits selon la sélection de l'utilisateur
  if (sortBy.value === 'price-asc') {
    return [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price-desc') {
    return [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy.value === 'rating') {
    return [...products].sort((a, b) => b.rating - a.rating);
  }

  return products;
});

// Lie l'état des favoris aux objets produits correspondants
const favoriteProducts = computed(() => {
  return MOCK_PRODUCTS.filter(p => favorites.value.includes(p.id));
});

// Nombre de produits au panier
const totalCartCount = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.quantity, 0);
});


// GESTIONNAIRES D'ACTIONS (Fonctionnalités applicatives)

// Ouvrir une fiche produit de détail
const selectProduct = (product: Product) => {
  selectedProduct.value = product;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Fermer la fiche détails
const clearSelectedProduct = () => {
  selectedProduct.value = null;
};

// Ajouter/Retirer des favoris
const toggleFavorite = (productId: string) => {
  const index = favorites.value.indexOf(productId);
  if (index === -1) {
    favorites.value.push(productId);
  } else {
    favorites.value.splice(index, 1);
  }
};

// Ajouter un produit au panier
const addToCart = (product: Product) => {
  if (product.stock === 0) return;

  const existingItem = cart.value.find(item => item.product.id === product.id);
  if (existingItem) {
    // Si la quantité n'excède pas notre stock simulé
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
    }
  } else {
    cart.value.push({
      product,
      quantity: 1
    });
  }
  
  // Retour de micro-animation sympa : ouvre brièvement le panier pour rassurer l'utilisateur
  isCartOpen.value = true;
};

// Mettre à jour la quantité d'un article du panier
const updateQuantity = (productId: string, delta: number) => {
  const item = cart.value.find(item => item.product.id === productId);
  if (!item) return;

  const newQuantity = item.quantity + delta;
  if (newQuantity <= 0) {
    // Si la quantité passe à 0, on supprime l'article
    removeFromCart(productId);
  } else if (newQuantity <= item.product.stock) {
    item.quantity = newQuantity;
  }
};

// Retirer un article totalement du panier
const removeFromCart = (productId: string) => {
  cart.value = cart.value.filter(item => item.product.id !== productId);
};

// Vider le panier
const clearCart = () => {
  cart.value = [];
};

// Navigation générale : Aller au tunnel d'achat
const navigateToCheckout = () => {
  isCartOpen.value = false;
  activeScreen.value = 'checkout';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Retourner au catalogue d'exposition
const navigateToHome = () => {
  activeScreen.value = 'catalog';
  selectedProduct.value = null;
  activeTab.value = 'catalog';
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col text-slate-800">
    
    <!-- L'En-tête de l'application -->
    <Header
      v-model="searchTerm"
      v-model:sort-by="sortBy"
      :cart-count="totalCartCount"
      :wishlist-count="favorites.length"
      v-model:active-tab="activeTab"
      @clear-details="clearSelectedProduct"
      @open-cart="isCartOpen = true"
    />

    <!-- CORE CONTAINER : LE CHÂSSIS DE NAVIGATION COMPONENTIEL -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- ÉCRAN 1 : TUNNEL DE COMPLEMENT DE COMMANDE (CHECKOUT) -->
      <div v-if="activeScreen === 'checkout'">
        <Checkout
          :cart-items="cart"
          @clear-cart="clearCart"
          @back-to-cart="activeScreen = 'catalog'; isCartOpen = true"
          @navigate-home="navigateToHome"
        />
      </div>

      <!-- ÉCRAN 2 : CATALOGUE STANDARD / DETECTOR DE CHARGEMENT SQUELETTE -->
      <div v-else>
        <!-- Squelettes pendant l'attente -->
        <div v-if="isLoading" class="space-y-6">
          <Loader :type="selectedProduct ? 'detail' : 'grid'" />
        </div>

        <!-- Une fois les données prêtes -->
        <div v-else class="space-y-6">
          
          <!-- FICHE DE DÉTAILS DE PRODUIT SELECTIONNÉ -->
          <div v-if="selectedProduct">
            <ProductDetails
              :product="selectedProduct"
              :is-favorite="favorites.includes(selectedProduct.id)"
              @toggle-favorite="toggleFavorite(selectedProduct.id)"
              @add-to-cart="addToCart(selectedProduct)"
              @back="clearSelectedProduct"
            />
          </div>

          <!-- LA LISTE COMPLÈTE DE NOTRE SÉLECTION -->
          <div v-else>
            <!-- S'il s'agit de l'onglet favoris -->
            <div v-if="activeTab === 'wishlist'">
              <Wishlist
                :favorite-products="favoriteProducts"
                @remove-favorite="toggleFavorite"
                @add-to-cart="addToCart"
                @select-product="selectProduct"
                @navigate-to-catalog="activeTab = 'catalog'"
              />
            </div>

            <!-- S'il s'agit du catalogue standard principal -->
            <Catalog
              v-else
              v-model:selectedCategory="selectedCategory"
              :filtered-products="filteredProducts"
              :categories="categories"
              :favorites="favorites"
              @reset-filters="searchTerm = ''; selectedCategory = 'Tous'; sortBy = 'default'"
              @toggle-favorite="toggleFavorite"
              @add-to-cart="addToCart"
              @select-product="selectProduct"
            />
          </div>

        </div>
      </div>

    </main>

    <!-- COMPOSANT DRAWER GLOBAL : LE PANIER COULISSANT -->
    <Cart
      :is-open="isCartOpen"
      :cart-items="cart"
      @close="isCartOpen = false"
      @update-quantity="updateQuantity"
      @remove-item="removeFromCart"
      @checkout="navigateToCheckout"
    />

    <!-- PIED DE PAGE TECHNIQUE ÉLÉGANT -->
    <footer class="border-t border-slate-200/50 bg-white py-8 mt-12 text-center text-xs text-slate-400 font-sans">
      <div class="max-w-7xl mx-auto px-4 space-y-2">
        <p>© 2026 ÉcoShop Inc. Conçu avec amour pour votre apprentissage Vue 3.</p>
        <div class="flex items-center justify-center gap-4">
          <span>Mentions fictives</span>
          <span>•</span>
          <span>Données Sandbox</span>
          <span>•</span>
          <span>Composition API</span>
        </div>
      </div>
    </footer>

    <!-- Assistant WhatsApp Chatbot Intuitif -->
    <WhatsAppChat />

  </div>
</template>

<style>
/* CSS global ou réglages personnalisés supplémentaires utiles */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
