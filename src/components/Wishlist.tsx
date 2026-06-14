/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';

// Props pour la page de wishlist individuelle.
// Analogie VueJS : Props définies pour le composant favoris.
interface WishlistProps {
  favoriteProducts: Product[];
  onRemoveFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToCatalog: () => void;
}

export function Wishlist({
  favoriteProducts,
  onRemoveFavorite,
  onAddToCart,
  onSelectProduct,
  onNavigateToCatalog,
}: WishlistProps) {
  return (
    <div id="wishlist-view" className="space-y-6">
      
      {/* En-tête de page */}
      <div>
        <h1 className="font-sans font-extrabold text-2xl lg:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
          <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
          Mes Coups de Cœur
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Retrouvez ici tous les articles que vous avez sauvegardés pour plus tard.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        /* Écran vide si aucun favori */
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-lg mx-auto space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-slate-800 text-lg">Votre liste de favoris est vide</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
              Laissez-vous inspirer par nos meilleures offres ! Naviguez à travers le catalogue et touchez le cœur sur une carte produit pour l'ajouter ici.
            </p>
          </div>
          <button
            id="wishlist-empty-cta"
            onClick={onNavigateToCatalog}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            Explorer la boutique
          </button>
        </div>
      ) : (
        /* Grille des Favoris */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <motion.div
                key={`wish-card-${product.id}`}
                layout
                id={`wish-item-${product.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md overflow-hidden flex flex-col group transition-all duration-200"
              >
                {/* Image miniature avec lien de clic */}
                <div 
                  className="aspect-square bg-slate-50 relative cursor-pointer overflow-hidden"
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  />
                  
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-rose-500 text-white font-sans font-bold text-[10px] px-2.5 py-1 rounded-sm uppercase tracking-wider">
                        Rupture
                      </span>
                    </div>
                  )}

                  <span className="absolute top-2.5 left-2.5 bg-white text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-md border border-slate-100 shadow-none">
                    {product.category}
                  </span>
                </div>

                {/* Détails du produit */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="cursor-pointer" onClick={() => onSelectProduct(product)}>
                    <div className="flex items-center text-amber-500 gap-0.5 mb-1">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="text-[11px] font-semibold text-slate-700">{product.rating}</span>
                    </div>

                    <h3 className="font-sans font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Actions & Prix */}
                  <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Corbeille pour retirer */}
                      <button
                        id={`wish-remove-btn-${product.id}`}
                        onClick={() => onRemoveFavorite(product.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
                        title="Retirer des favoris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Panier pour ajouter directement */}
                      <button
                        id={`wish-add-to-cart-${product.id}`}
                        disabled={isOutOfStock}
                        onClick={() => onAddToCart(product)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isOutOfStock
                            ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                            : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                        }`}
                        title={isOutOfStock ? "Indisponible" : "Ajouter au panier"}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
