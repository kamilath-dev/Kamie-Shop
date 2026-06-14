<script setup lang="ts">
// On accepte une prop "type" pour choisir quel squelette charger
defineProps<{
  type: 'grid' | 'detail';
}>();
</script>

<template>
  <!-- SQUELETTE POUR LA GRILLE DE PRODUITS (CATALOGUE) -->
  <div v-if="type === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div 
      v-for="i in 8" 
      :key="i" 
      class="bg-white rounded-2xl border border-slate-100 p-4 space-y-4 animate-pulse"
    >
      <div class="aspect-square w-full bg-slate-200 rounded-xl"></div>
      <div class="space-y-2">
        <div class="h-4 bg-slate-200 rounded-sm w-1/3"></div>
        <div class="h-6 bg-slate-200 rounded-sm w-3/4"></div>
        <div class="h-4 bg-slate-200 rounded-sm w-full"></div>
      </div>
      <div class="flex items-center justify-between pt-2">
        <div class="h-6 bg-slate-200 rounded-sm w-1/4"></div>
        <div class="h-9 bg-slate-200 rounded-xl w-1/3"></div>
      </div>
    </div>
  </div>

  <!-- SQUELETTE POUR LA PAGE DE DÉTAIL D'UN PRODUIT -->
  <div v-else-if="type === 'detail'" class="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 animate-pulse space-y-8">
    <div class="h-6 bg-slate-200 rounded-sm w-24"></div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-4">
        <div class="aspect-square bg-slate-200 rounded-2xl w-full"></div>
        <div class="flex gap-2">
          <div v-for="j in 3" :key="j" class="w-20 h-20 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="h-4 bg-slate-200 rounded-sm w-1/5"></div>
          <div class="h-10 bg-slate-200 rounded-sm w-3/4"></div>
          <div class="h-4 bg-slate-200 rounded-sm w-24"></div>
        </div>
        <div class="h-16 bg-slate-200 rounded-sm w-full"></div>
        <div class="flex items-center gap-4 pt-4">
          <div class="h-12 bg-slate-200 rounded-xl w-1/4"></div>
          <div class="h-12 bg-slate-200 rounded-xl flex-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>
