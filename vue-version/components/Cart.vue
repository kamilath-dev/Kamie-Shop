<script setup lang="ts">
import { computed } from 'vue';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-vue-next';
import { CartItem } from '../types';

const props = defineProps<{
  isOpen: boolean;
  cartItems: CartItem[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update-quantity', productId: string, delta: number): void;
  (e: 'remove-item', productId: string): void;
  (e: 'checkout'): void;
}>();

// CALCULS AVEC DES COMPUTED (Équivalents à useMemo() de React)
const subtotal = computed(() => {
  return props.cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
});

const isFreeShipping = computed(() => {
  return subtotal.value >= 60;
});

const shippingCost = computed(() => {
  if (subtotal.value === 0) return 0;
  return isFreeShipping.value ? 0 : 4.90;
});

const total = computed(() => {
  return subtotal.value + shippingCost.value;
});

const totalItemsCount = computed(() => {
  return props.cartItems.reduce((acc, item) => acc + item.quantity, 0);
});
</script>

<template>
  <transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end"
      @click="emit('close')"
    >
      <!-- Panneau coulissant blanc (Arrêt de propagation du clic pour ne pas fermer à l'intérieur) -->
      <transition name="slide">
        <div 
          v-if="isOpen"
          class="w-full max-w-md bg-white h-full shadow-2xl flex flex-col relative"
          @click.stop
        >
          <!-- En-tête du tiroir -->
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <ShoppingBag class="w-5 h-5 text-indigo-600" />
              <h2 class="font-sans font-bold text-lg text-slate-800">Votre panier</h2>
              <span class="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {{ totalItemsCount }}
              </span>
            </div>
            <button
              @click="emit('close')"
              class="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- LISTE DES ARTICLES DANS LE PANIER -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- État vide -->
            <div 
              v-if="cartItems.length === 0" 
              class="h-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <ShoppingBag class="w-8 h-8" />
              </div>
              <div>
                <h3 class="font-sans font-bold text-slate-700 text-base">Votre panier est vide</h3>
                <p class="text-xs text-slate-400 mt-1">Laissez-vous tenter par l'un de nos articles éco-responsables !</p>
              </div>
              <button
                @click="emit('close')"
                class="px-5 py-2 rounded-xl text-xs bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 font-sans font-semibold transition-colors"
              >
                Continuer mes achats
              </button>
            </div>

            <!-- Liste effective des produits -->
            <div 
              v-else 
              v-for="item in cartItems" 
              :key="item.product.id"
              class="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <!-- Image miniature -->
              <div class="w-20 h-20 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                <img
                  :src="item.product.mainImage"
                  :alt="item.product.name"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Titre, quantité & contrôles -->
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start gap-2">
                    <h4 class="font-sans font-semibold text-slate-800 text-xs sm:text-sm line-clamp-1">
                      {{ item.product.name }}
                    </h4>
                    <button
                      @click="emit('remove-item', item.product.id)"
                      class="text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                      title="Supprimer l'article"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                  <span class="text-xs text-slate-500 font-sans block mt-0.5 uppercase tracking-wide">
                    {{ item.product.category }}
                  </span>
                </div>

                <div class="flex justify-between items-center mt-2">
                  <!-- Gestion du nombre d'articles +/- -->
                  <div class="flex items-center border border-slate-100 rounded-lg bg-slate-50 p-1">
                    <button
                      @click="emit('update-quantity', item.product.id, -1)"
                      class="p-1 rounded-md text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-2xs active:scale-95 shrink-0"
                    >
                      <Minus class="w-3.5 h-3.5" />
                    </button>
                    <span class="w-8 text-center font-mono font-bold text-xs text-slate-700">
                      {{ item.quantity }}
                    </span>
                    <button
                      :disabled="item.quantity >= item.product.stock"
                      @click="emit('update-quantity', item.product.id, 1)"
                      class="p-1 rounded-md text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-2xs active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent shrink-0"
                    >
                      <Plus class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <!-- Prix calculé unitaire/total -->
                  <span class="font-mono font-bold text-xs sm:text-sm text-slate-800">
                    {{ (item.product.price * item.quantity).toFixed(2) }} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION DES COMPTES FINAUX (PIED DU TIROIR) -->
          <div v-if="cartItems.length > 0" class="border-t border-slate-100 bg-slate-50/50 p-6 space-y-4">
            
            <!-- Détail financier -->
            <div class="space-y-2 text-sm text-slate-600">
              <div class="flex justify-between font-sans">
                <span>Sous-total</span>
                <span class="font-mono font-semibold">{{ subtotal.toFixed(2) }} €</span>
              </div>
              <div class="flex justify-between font-sans">
                <span>Frais de port</span>
                <span class="font-mono font-semibold" v-if="shippingCost === 0">Offerts</span>
                <span class="font-mono font-semibold" v-else>{{ shippingCost.toFixed(2) }} €</span>
              </div>

              <!-- Jauge de frais de port offert interactive -->
              <div class="pt-2">
                <div v-if="!isFreeShipping" class="space-y-1.5 text-xs text-slate-500">
                  <p>
                    Plus que <strong class="font-mono font-bold text-indigo-500">{{ (60 - subtotal).toFixed(2) }} €</strong> pour profiter de la <strong>livraison gratuite</strong> !
                  </p>
                  <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-indigo-500 transition-all duration-300"
                      :style="{ width: (subtotal / 60 * 100) + '%' }"
                    ></div>
                  </div>
                </div>
                <div v-else class="text-xs text-emerald-600 font-sans font-semibold flex items-center gap-1.5">
                  ✓ Vous bénéficiez de la livraison gratuite !
                </div>
              </div>
            </div>

            <div class="border-t border-slate-200/50 pt-4 flex justify-between items-center text-slate-800">
              <span class="font-sans font-bold text-base">Total TTC</span>
              <span class="font-mono font-black text-lg md:text-xl text-indigo-700">
                {{ total.toFixed(2) }} €
              </span>
            </div>

            <!-- Bouton de validation de commande -->
            <button
              @click="emit('checkout')"
              class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition-all active:scale-98 cursor-pointer"
            >
              <span>Passer à la caisse</span>
              <ArrowRight class="w-4 h-4 animate-pulse" />
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* Animations Vue pour le Drawer */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style>
