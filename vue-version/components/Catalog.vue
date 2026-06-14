<script setup lang="ts">
import { Category, Product } from '../types';
import ProductCard from './ProductCard.vue';

// On définit les propriétés nécessaires au catalogue
defineProps<{
  filteredProducts: Product[];
  categories: Category[];
  selectedCategory: Category;
  favorites: string[];
}>();

// On déclare les évènements vers le parent (App.vue)
const emit = defineEmits<{
  (e: 'update:selectedCategory', category: Category): void;
  (e: 'reset-filters'): void;
  (e: 'toggle-favorite', productId: string): void;
  (e: 'add-to-cart', product: Product): void;
  (e: 'select-product', product: Product): void;
}>();
</script>

<template>
  <div class="space-y-6">
    
    <!-- FILTRANTS PAR CARROUSEL DE CATEGORIES -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="emit('update:selectedCategory', cat)"
        :class="[
          'px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-medium transition-all shrink-0',
          selectedCategory === cat
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-100 hover:border-slate-250/50'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- TITRE DU CATALOGUE FILTRÉ -->
    <div>
      <h1 class="font-sans font-black text-xl sm:text-2xl text-slate-800">
        {{ selectedCategory === 'Tous' ? 'Tous nos produits' : selectedCategory }}
      </h1>
      <p class="text-xs text-slate-500 mt-1">
        {{ filteredProducts.length }} article{{ filteredProducts.length > 1 ? 's' : '' }} disponible{{ filteredProducts.length > 1 ? 's' : '' }}
      </p>
    </div>

    <!-- ÉTAT VIDE : Recherche sans résultat -->
    <div 
      v-if="filteredProducts.length === 0" 
      class="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-sm mx-auto space-y-3"
    >
      <p class="text-sm font-sans font-bold text-slate-700">Aucun produit trouvé</p>
      <p class="text-xs text-slate-400">Essayez de modifier votre recherche ou de vider le filtre.</p>
      <button 
        @click="emit('reset-filters')"
        class="px-4 py-2 rounded-xl text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold font-sans mt-2"
      >
        Réinitialiser
      </button>
    </div>

    <!-- GRILLE DE PRODUITS CONFORME -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :is-favorite="favorites.includes(product.id)"
        @toggle-favorite="emit('toggle-favorite', product.id)"
        @add-to-cart="emit('add-to-cart', product)"
        @click="emit('select-product', product)"
      />
    </div>

  </div>
</template>

<style scoped>
/* Styles de barre de défilement masquée pour le carrousel */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
