/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, Star, ShoppingCart, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

// Props pour le composant de détail.
// Analogie VueJS : Props d'entrée et évènements émis (ex : @close="$emit('back')")
interface ProductDetailsProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onBack: () => void;
}

export function ProductDetails({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onBack,
}: ProductDetailsProps) {
  // En React, useState gère l'état local. Ici, on stocke l'index de l'image sélectionnée dans la galerie.
  // Analogie VueJS : const selectedImageIndex = ref(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isOutOfStock = product.stock <= 0;

  return (
    <div id="product-detail-view" className="space-y-6">
      
      {/* Bouton Retour */}
      <button
        id="detail-back-btn"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au catalogue
      </button>

      {/* Grid Principal */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Section Visuelle (Galerie d'images) */}
          <div className="space-y-4">
            
            {/* Image Principale active */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100"
            >
              <img
                src={product.gallery[selectedImageIndex] || product.mainImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Vignettes de la Galerie */}
            {/* Analogie VueJS : v-for="(img, idx) in product.gallery" :key="idx" */}
            <div className="grid grid-cols-3 gap-3">
              {product.gallery.map((image, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  id={`thumb-btn-${index}`}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-indigo-600 ring-2 ring-indigo-100'
                      : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Vue ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Section Infos & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Catégorie & Favoris */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>

                <button
                  id="detail-fav-btn"
                  onClick={onToggleFavorite}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                    isFavorite
                      ? 'bg-pink-50 border-pink-100 text-pink-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
                  {isFavorite ? 'Favori !' : 'Favoris'}
                </button>
              </div>

              {/* Titre du Produit */}
              <h1 className="font-sans font-bold text-2xl lg:text-3xl text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Note (Étoiles) */}
              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-amber-500' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700 ml-1">
                  {product.rating} / 5
                </span>
                <span className="text-xs text-slate-400 font-medium ml-1">
                  (basé sur 48 avis clients)
                </span>
              </div>

              {/* Séparateur */}
              <div className="border-t border-slate-100 my-4" />

              {/* Prix */}
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Prix unitaire</span>
                  <span className="font-sans font-extrabold text-2xl lg:text-3xl text-indigo-600">
                    {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                
                {/* Statut Stock */}
                <div>
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Épuisé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      En Stock ({product.stock} restants)
                    </span>
                  )}
                </div>
              </div>

              {/* Description Complète */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800">Description du produit</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {product.description}
                </p>
              </div>

            </div>

            {/* Bouton Action Panier */}
            <div className="pt-6 border-t border-slate-100">
              <button
                id="detail-add-to-cart-btn"
                onClick={onAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 px-6 rounded-2xl font-sans font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-xs ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-100 active:scale-98'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? 'Victime de son succès' : 'Ajouter au Panier'}
              </button>
              
              {!isOutOfStock && product.stock <= 4 && (
                <p className="text-center text-xs text-amber-600 font-semibold mt-2.5">
                  ⚠️ Dépêchez-vous ! Il ne reste plus que {product.stock} exemplaires en stock.
                </p>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
