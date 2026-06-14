<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronLeft, Heart, ShoppingCart, Star, Shield, Truck, RotateCcw } from 'lucide-vue-next';
import { Product } from '../types';

// Nous définissons les propriétés
const props = defineProps<{
  product: Product;
  isFavorite: boolean;
}>();

// Nous déclarons les événements renvoyés au parent ou à la racine App.vue
const emit = defineEmits<{
  (e: 'toggle-favorite'): void;
  (e: 'add-to-cart'): void;
  (e: 'back'): void;
}>();

// État réactif local : comme un useState(0) en React !
const selectedImageIndex = ref(0);

// Si l'utilisateur change de produit de détail, nous réinitialisons l'index de l'image à 0
watch(() => props.product.id, () => {
  selectedImageIndex.value = 0;
});
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto w-full">
    <!-- Fil d'Ariane pour revenir en arrière -->
    <button
      id="back-to-catalog-btn"
      @click="emit('back')"
      class="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-sans font-medium text-sm transition-colors cursor-pointer group"
    >
      <ChevronLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>Retour au catalogue</span>
    </button>

    <!-- Fiche détaillée du Produit -->
    <div class="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 xl:gap-12 items-start">
        
        <!-- SECTION DE GAUCHE : Galerie d'images interactive -->
        <div class="space-y-4 lg:col-span-5">
          <!-- Image active principale -->
          <div class="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative">
            <img
              :src="product.gallery[selectedImageIndex] || product.mainImage"
              :alt="product.name"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover"
            />
            
            <!-- Etiquette de stock si en rupture -->
            <div 
              v-if="product.stock === 0" 
              class="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-centerReady"
            >
              <span class="bg-rose-500 text-white text-xs font-sans font-bold px-4 py-2 rounded-lg shadow-md">
                Rupture temporaire
              </span>
            </div>
          </div>

          <!-- Miniatures pour naviguer dans la galerie d'images -->
          <div v-if="product.gallery && product.gallery.length > 1" class="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              v-for="(image, index) in product.gallery"
              :key="index"
              @click="selectedImageIndex = index"
              :class="[
                'w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0',
                selectedImageIndex === index
                  ? 'border-indigo-600 shadow-sm scale-95'
                  : 'border-slate-100 hover:border-slate-300'
              ]"
            >
              <img
                :src="image"
                alt="Miniature"
                referrerpolicy="no-referrer"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- SECTION DE DROITE : Descriptifs et Tarification -->
        <div class="flex flex-col space-y-6 lg:col-span-7">
          <div class="space-y-2">
            <!-- Catégorie -->
            <span class="text-xs font-sans font-bold text-indigo-600 tracking-wider uppercase">
              {{ product.category }}
            </span>
            <!-- Nom du produit -->
            <h1 class="font-sans font-extrabold text-2xl md:text-3xl text-slate-800 leading-tight">
              {{ product.name }}
            </h1>
            
            <!-- Note & Évaluations client -->
            <div class="flex items-center gap-2 pt-1">
              <div class="flex items-center text-amber-500">
                <Star v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= Math.round(product.rating) ? 'fill-amber-500' : 'text-slate-200'" />
              </div>
              <span class="text-xs font-mono font-bold text-slate-700">{{ product.rating.toFixed(1) }} / 5.0</span>
              <span class="text-xs text-slate-400">|</span>
              <span class="text-xs text-slate-400">Avis vérifié original</span>
            </div>
          </div>

          <!-- Description complète -->
          <div class="space-y-3">
            <p class="text-sm text-slate-600 leading-relaxed font-sans">
              {{ product.description }}
            </p>
          </div>

          <!-- Statut de stock & Infos de livraison rapide -->
          <div class="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-sans font-medium">Disponibilité :</span>
              <span 
                :class="[
                  'font-sans font-semibold',
                  product.stock > 5 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-rose-500'
                ]"
              >
                {{ product.stock > 5 ? 'En stock' : product.stock > 0 ? `Seulement ${product.stock} restants` : 'Rupture de Stock' }}
              </span>
            </div>

            <!-- Grille des avantages écoShop -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/50">
              <div class="flex items-center gap-2 text-slate-600">
                <Truck class="w-4 h-4 text-emerald-500 shrink-0" />
                <span class="text-[10px] sm:text-xs">Livraison Offerte</span>
              </div>
              <div class="flex items-center gap-2 text-slate-600">
                <Shield class="w-4 h-4 text-indigo-500 shrink-0" />
                <span class="text-[10px] sm:text-xs">Garantie 2 ans</span>
              </div>
              <div class="flex items-center gap-2 text-slate-600">
                <RotateCcw class="w-4 h-4 text-slate-500 shrink-0" />
                <span class="text-[10px] sm:text-xs">Retours 30j</span>
              </div>
            </div>
          </div>

          <!-- Boutons de commande d'actions -->
          <div class="pt-2 flex flex-col sm:flex-row gap-4 items-center">
            <!-- Prix -->
            <div class="sm:text-left text-center shrink-0">
              <span class="text-[10px] text-slate-400 font-sans block">Prix public conseillé</span>
              <span class="font-mono font-black text-2xl md:text-3xl text-slate-800">
                {{ product.price.toFixed(2) }} €
              </span>
            </div>

            <div class="flex gap-3 w-full">
              <!-- Bouton Ajouter au panier -->
              <button
                id="add-to-cart-big-btn"
                :disabled="product.stock === 0"
                @click="emit('add-to-cart')"
                :class="[
                  'flex-1 py-3.5 px-6 rounded-xl font-sans font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-sm transition-all duration-200',
                  product.stock === 0
                    ? 'bg-slate-150 border border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-100 active:scale-98'
                ]"
              >
                <ShoppingCart class="w-4.5 h-4.5" />
                <span>{{ product.stock === 0 ? 'Indisponible' : 'Ajouter au Panier' }}</span>
              </button>

              <!-- Bouton Ajouter aux favoris additionnel -->
              <button
                id="toggle-fav-big-btn"
                @click="emit('toggle-favorite')"
                :class="[
                  'p-3.5 rounded-xl border flex items-center justify-center transition-all active:scale-95',
                  isFavorite
                    ? 'border-pink-200 bg-pink-50 text-pink-600'
                    : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                ]"
                title="Ajouter aux favoris"
              >
                <Heart class="w-5 h-5" :class="{ 'fill-pink-600': isFavorite }" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
