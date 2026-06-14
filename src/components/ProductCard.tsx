/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

// Props définissant les interactions de la carte produit.
// Analogie VueJS : Les props et les custom events émis par le composant.
interface ProductCardProps {
  key?: string;
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onClick: () => void;
}

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onClick,
}: ProductCardProps): React.JSX.Element {
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1.5 cursor-pointer overflow-hidden flex flex-col group transition-all duration-300"
    >
      {/* Conteneur de l'image principale */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <img
          src={product.mainImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Catégorie badge */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100 shadow-xs">
          {product.category}
        </span>

        {/* Bouton Favoris (Wishlist) */}
        {/* Analogie VueJS : @click.stop="toggleFavorite" pour stopper la propagation de l'événement clic de carte */}
        <button
          id={`fav-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation(); // Évite d'ouvrir le détail du produit
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full border shadow-xs transition-transform duration-200 active:scale-90 ${
            isFavorite
              ? 'bg-pink-50 border-pink-100 text-pink-500 hover:bg-pink-100'
              : 'bg-white border-slate-100 text-slate-400 hover:text-slate-600'
          }`}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-500' : ''}`} />
        </button>

        {/* Badge Rupture de stock si épuisé */}
        {/* Analogie VueJS : v-if="isOutOfStock" */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-500 text-white font-sans font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm tracking-wider uppercase">
              Rupture de Stock
            </span>
          </div>
        )}
      </div>

      {/* Détails du produit */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Note & Stock Label */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-amber-500 gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span className="text-xs font-semibold text-slate-700">{product.rating}</span>
            </div>
            
            <span className={`text-[11px] font-medium ${isOutOfStock ? 'text-rose-500' : 'text-emerald-600'}`}>
              {isOutOfStock ? 'Indisponible' : `${product.stock} en stock`}
            </span>
          </div>

          {/* Nom du produit */}
          <h3 className="font-sans font-semibold text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {/* Description courte */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Prix & Bouton Ajouter */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Prix</span>
            <span className="font-sans font-bold text-base text-slate-900">
              {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>

          <button
            id={`add-to-cart-quick-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onAddToCart();
            }}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white hover:shadow-xs active:scale-95'
            }`}
            title={isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
