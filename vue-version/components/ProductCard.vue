<script setup lang="ts">
import { Heart, ShoppingCart, Truck } from 'lucide-vue-next';
import type { Product } from '../types';

// Nous définissons les propriétés attendues
defineProps<{
  product: Product;
  isFavorite: boolean;
}>();

// Déclaration des événements renvoyés au parent/catalogue
const emit = defineEmits<{
  (e: 'toggle-favorite'): void;
  (e: 'add-to-cart'): void;
  (e: 'click'): void;
}>();
</script>

<template>
  <div
    :id="'product-card-' + product.id"
    @click="emit('click')"
    class="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 p-4 flex flex-col h-full cursor-pointer hover:shadow-xl hover:shadow-slate-150/30 transition-all duration-300 relative"
  >
    
    <!-- Zone Image avec badges et bouton interactif favoris -->
    <div class="relative aspect-square w-full bg-slate-50/70 rounded-xl overflow-hidden mb-4 border border-slate-100/50">
      <img
        :src="product.mainImage"
        :alt="product.name"
        referrerpolicy="no-referrer"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />
      
      <!-- Badges de Stock flotants -->
      <div class="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        <span
          v-if="product.stock === 0"
          class="bg-rose-500 text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg shadow-sm"
        >
          Rupture
        </span>
        <span
          v-else-if="product.stock <= 5"
          class="bg-amber-500 text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg shadow-sm"
        >
          Presque épuisé
        </span>
      </div>
      
      <!-- Bouton favori flotant sur l'image -->
      <button
        id="toggle-fav-card-btn"
        @click.stop="emit('toggle-favorite')"
        :class="[
          'absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md border transition-all active:scale-90 hover:scale-105 cursor-pointer z-15',
          isFavorite
            ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
            : 'bg-white/80 border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-white'
        ]"
        title="Ajouter aux favoris"
      >
        <Heart class="w-4 h-4" :class="{ 'fill-current': isFavorite }" />
      </button>
    </div>

    <!-- Détails textuels du produit -->
    <div class="flex-grow flex flex-col text-left">
      <!-- Catégorie -->
      <span class="text-[10px] font-sans font-bold text-indigo-600 uppercase tracking-widest mb-1.5 block">
        {{ product.category }}
      </span>
      
      <!-- Titre avec transition colorée au survol -->
      <h3 class="font-sans font-extrabold text-sm sm:text-base text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">
        {{ product.name }}
      </h3>
      
      <!-- Courte description -->
      <p class="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed mb-3 h-8">
        {{ product.shortDescription }}
      </p>

      <!-- Évaluations et Info de livraison pour compléter le design -->
      <div class="flex items-center justify-between text-[11px] text-slate-500 mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100/50 mt-auto">
        <div class="flex items-center gap-1">
          <span class="text-amber-500">★</span>
          <span class="font-sans font-bold text-slate-700">{{ product.rating.toFixed(1) }}</span>
        </div>
        <div class="flex items-center gap-1 font-medium font-sans text-slate-500 shrink-0">
          <Truck class="w-3.5 h-3.5 text-emerald-500" />
          <span>Livraison Offerte</span>
        </div>
      </div>
    </div>

    <!-- Prix et Pied de carte avec Bouton d'achat rapide -->
    <div class="pt-3 border-t border-slate-100/80 flex items-center justify-between gap-2">
      <div class="text-left font-sans">
        <span class="text-[9px] text-slate-400 block uppercase font-semibold leading-none mb-0.5">Prix</span>
        <span class="font-mono font-black text-sm sm:text-base text-slate-800 tracking-tight whitespace-nowrap">
          {{ product.price.toLocaleString('fr-FR') }} FCFA
        </span>
      </div>

      <!-- Bouton Panier interactif d'action rapide -->
      <button
        id="quick-add-to-cart-btn"
        :disabled="product.stock === 0"
        @click.stop="emit('add-to-cart')"
        :class="[
          'px-3.5 py-2 rounded-xl font-sans font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-sm transition-all duration-250 cursor-pointer border',
          product.stock === 0
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 text-white border-indigo-600 hover:shadow-indigo-100 active:scale-95'
        ]"
      >
        <ShoppingCart class="w-3.5 h-3.5" />
        <span class="hidden xs:inline">Ajouter</span>
      </button>
    </div>

  </div>
</template>
