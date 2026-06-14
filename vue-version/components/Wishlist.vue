<script setup lang="ts">
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-vue-next';
import { Product } from '../types';

defineProps<{
  favoriteProducts: Product[];
}>();

const emit = defineEmits<{
  (e: 'remove-favorite', productId: string): void;
  (e: 'add-to-cart', product: Product): void;
  (e: 'select-product', product: Product): void;
  (e: 'navigate-to-catalog'): void;
}>();
</script>

<template>
  <div class="space-y-6">
    <!-- En-tête de la vue favoris -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-sans font-extrabold text-2xl text-slate-800 flex items-center gap-2">
          <Heart class="w-6 h-6 text-pink-500 fill-pink-500" />
          <span>Mes favoris</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">Consultez et ajoutez au panier vos produits enregistrés</p>
      </div>
      <button
        @click="emit('navigate-to-catalog')"
        class="text-xs font-sans font-semibold text-indigo-600 hover:underline cursor-pointer"
      >
        Retourner au catalogue
      </button>
    </div>

    <!-- ÉTAT VIDE : Aucun favoris enregistré -->
    <div 
      v-if="favoriteProducts.length === 0"
      class="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-lg mx-auto space-y-5"
    >
      <div class="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
        <Heart class="w-8 h-8" />
      </div>
      <div class="space-y-2">
        <h3 class="font-sans font-bold text-slate-800 text-lg">Votre liste est vide</h3>
        <p class="text-xs text-slate-500 leading-relaxed">
          Explorez notre superbe collection et ajoutez des coups de cœur pour les retrouver ici en un clin d'œil.
        </p>
      </div>
      <button
        @click="emit('navigate-to-catalog')"
        class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs rounded-xl shadow-md shadow-indigo-150 transition-all cursor-pointer"
      >
        Découvrir le catalogue
      </button>
    </div>

    <!-- GRILLE DE PRODUITS FAVORIS -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="product in favoriteProducts"
        :key="product.id"
        class="bg-white rounded-xl border border-slate-100 p-4 flex flex-col hover:border-slate-200 hover:shadow-md transition-all relative group cursor-pointer"
        @click="emit('select-product', product)"
      >
        <!-- Bouton de retrait rapide de la wishlist -->
        <button
          @click.stop="emit('remove-favorite', product.id)"
          class="absolute top-2.5 right-2.5 p-1.5 bg-white/95 rounded-lg border border-slate-100 text-slate-400 hover:text-rose-500 transition-colors shadow-2xs z-10"
          title="Retirer des favoris"
        >
          <Trash2 class="w-4 h-4" />
        </button>

        <!-- Image miniature -->
        <div class="relative aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3">
          <img
            :src="product.mainImage"
            :alt="product.name"
            referrerpolicy="no-referrer"
            class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        </div>

        <!-- Infos textuelles -->
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1 mb-1">
              <Star class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span class="text-xs font-mono font-semibold text-slate-600">{{ product.rating }}</span>
            </div>
            <h3 class="font-sans font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {{ product.name }}
            </h3>
            <span class="text-xs text-slate-400 font-sans block mt-0.5 uppercase">{{ product.category }}</span>
          </div>

          <!-- Actions de bas de carte -->
          <div class="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
            <span class="font-mono font-bold text-sm text-slate-800">
              {{ product.price.toFixed(2) }} €
            </span>

            <button
              :disabled="product.stock === 0"
              @click.stop="emit('add-to-cart', product)"
              class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart class="w-3.5 h-3.5" />
              <span>Acheter</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
