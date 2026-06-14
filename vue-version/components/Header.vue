<script setup lang="ts">
import { computed } from 'vue';
import { ShoppingBag, Heart, Search, Store } from 'lucide-vue-next';

// On déclare les props reçus avec defineProps (équivalent des properties de React).
const props = defineProps<{
  cartCount: number;
  wishlistCount: number;
  activeTab: 'catalog' | 'wishlist';
  modelValue: string; // Utilisé pour le v-model de la recherche !
  sortBy: string; // Utilisé pour le tri des produits !
}>();

// On déclare les événements que ce composant peut envoyer à son parent (App.vue)
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:activeTab', value: 'catalog' | 'wishlist'): void;
  (e: 'update:sortBy', value: string): void;
  (e: 'open-cart'): void;
  (e: 'clear-details'): void;
}>();

// Raccourci calculé pour lier réactivement l'input au v-model du parent
const search = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const selectTab = (tab: 'catalog' | 'wishlist') => {
  emit('clear-details');
  emit('update:activeTab', tab);
};
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 gap-4">
        
        <!-- Logo - Clic dessus réinitialise la vue principale -->
        <div 
          id="logo-brand"
          class="flex items-center gap-2 cursor-pointer select-none group"
          @click="selectTab('catalog')"
        >
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
            <Store class="w-5 h-5" />
          </div>
          <span class="font-sans font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
            Kamie Shop <span class="text-xs font-semibold text-indigo-500 uppercase tracking-wider block sm:inline sm:ml-1">Mini</span>
          </span>
        </div>

        <!-- Recherche par mot-clé et Option de tri avec le v-model de Vue -->
        <div class="flex-1 max-w-lg flex items-center gap-2">
          <div class="flex-grow max-w-md relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search class="w-4 h-4" />
            </div>
            <input
              id="search-input"
              type="text"
              placeholder="Rechercher un produit..."
              v-model="search"
              class="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
            />
            <button 
              v-if="search"
              @click="search = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Effacer
            </button>
          </div>

          <!-- Menu Déroulant pour le Tri des produits -->
          <div class="shrink-0">
            <select
              id="sort-select"
              :value="sortBy"
              @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
              class="bg-slate-50 border border-slate-200 text-slate-755 hover:border-slate-305 hover:bg-slate-100 rounded-xl px-2 sm:px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 font-sans font-medium cursor-pointer transition-all"
            >
              <option value="default">Pertinence</option>
              <option value="price-asc">€ Prix croissant</option>
              <option value="price-desc">$ Prix décroissant</option>
              <option value="rating">Note client ★</option>
            </select>
          </div>
        </div>

        <!-- Boutons d'interaction : Wishlist & Panier -->
        <div class="flex items-center gap-3">
          
          <!-- Bouton Favoris (Wishlist) -->
          <button
            id="wishlist-nav-btn"
            @click="selectTab('wishlist')"
            :class="[
              'p-2.5 rounded-xl border relative transition-all duration-200',
              activeTab === 'wishlist'
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800'
            ]"
            title="Voir mes favoris"
          >
            <Heart 
              class="w-5 h-5" 
              :class="{ 'fill-indigo-600': activeTab === 'wishlist' }"
            />
            
            <transition name="scale">
              <span
                v-if="wishlistCount > 0"
                class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs"
              >
                {{ wishlistCount }}
              </span>
            </transition>
          </button>

          <!-- Bouton Panier -->
          <button
            id="cart-nav-btn"
            @click="emit('open-cart')"
            class="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 relative transition-all duration-200"
            title="Ouvrir le panier"
          >
            <ShoppingBag class="w-5 h-5" />
            
            <transition name="scale">
              <span
                v-if="cartCount > 0"
                class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs"
              >
                {{ cartCount }}
              </span>
            </transition>
          </button>

        </div>

      </div>
    </div>
  </header>
</template>

<style scoped>
/* Traces d'animations simples pour les badges de notification */
.scale-enter-active, .scale-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.6);
  opacity: 0;
}
</style>
