/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Ce composant "Squelette" fournit un état de chargement visuel animé (effet "pulse").
// C'est une excellente pratique moderne d'expérience utilisateur (UX) recommandée dans les TP.
// Analogie VueJS : Un composant simple avec des classes CSS statiques.

interface LoaderProps {
  count?: number;
}

export function SkeletonLoader({ count = 4 }: LoaderProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          id={`skeleton-card-${index}`}
          className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs animate-pulse"
        >
          {/* Image squelette */}
          <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
          
          {/* Badge Catégorie squelette */}
          <div className="h-4 bg-slate-200 rounded-sm w-1/4 mb-3" />
          
          {/* Titre du produit squelette */}
          <div className="h-6 bg-slate-200 rounded-sm w-3/4 mb-2" />
          
          {/* Description squelette */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-slate-200 rounded-sm w-full" />
            <div className="h-3 bg-slate-200 rounded-sm w-5/6" />
          </div>
          
          {/* Prix & Bouton squelette */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <div className="h-6 bg-slate-200 rounded-sm w-1/4" />
            <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeletonLoader() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8 shadow-xs animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Galerie d'images squelette */}
      <div className="space-y-4">
        <div className="w-full h-96 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 bg-slate-200 rounded-xl" />
          <div className="h-20 bg-slate-200 rounded-xl" />
          <div className="h-20 bg-slate-200 rounded-xl" />
        </div>
      </div>
      
      {/* Détails squelette */}
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-slate-200 rounded-sm w-1/4 mb-3" />
          <div className="h-8 bg-slate-200 rounded-sm w-3/4 mb-3" />
          <div className="h-4 bg-slate-200 rounded-sm w-1/3" />
        </div>
        
        <div className="h-10 bg-slate-200 rounded-sm w-1/4" />
        
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded-sm w-full" />
          <div className="h-3 bg-slate-200 rounded-sm w-full" />
          <div className="h-3 bg-slate-200 rounded-sm w-2/3" />
        </div>
        
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="h-12 bg-slate-200 rounded-xl w-full" />
          <div className="h-12 bg-slate-200 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
