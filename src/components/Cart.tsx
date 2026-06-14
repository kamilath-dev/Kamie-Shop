/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartItem } from '../types';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Props pour le composant Panier.
// Analogie VueJS : Propriétés reçues et événements émis via $emit ou callbacks.
interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  
  // En React, les valeurs calculées se font simplement lors du rendu ou par useMemo.
  // Analogie VueJS : const subtotal = computed(() => ...)
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 50.00;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 4.90);
  const total = subtotal + shippingCost;
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    // AnimatePresence permet d'animer les entrées et sorties de composants enfants en React.
    // Analogie VueJS : <transition name="slide"> ... </transition>.
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Arrière-plan flouté d'overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Panneau Latéral Coulissant (Cart Drawer) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header du panier */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h2 className="font-sans font-bold text-lg text-slate-950">Votre Panier ({totalItemCount})</h2>
              </div>
              <button
                id="cart-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg border border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Liste des Produits ou écran vide */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-slate-800">Votre panier est vide</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Explorez notre catalogue et ajoutez des merveilles à votre sélection !
                    </p>
                  </div>
                  <button
                    id="cart-empty-back-btn"
                    onClick={onClose}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Découvrir les produits
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const itemSubtotal = item.product.price * item.quantity;
                  const isMaxReached = item.quantity >= item.product.stock;

                  return (
                    <motion.div
                      key={`cart-item-${item.product.id}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl"
                    >
                      {/* Miniature Image */}
                      <div className="w-16 h-16 rounded-lg bg-white overflow-hidden border border-slate-200 shrink-0">
                        <img
                          src={item.product.mainImage}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Infos produit */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-sans font-semibold text-xs text-slate-800 truncate" title={item.product.name}>
                              {item.product.name}
                            </h4>
                            
                            <button
                              id={`cart-remove-${item.product.id}`}
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-sm hover:bg-white transition-colors"
                              title="Retirer cet article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <span className="text-xs font-medium text-slate-500 block">
                            {item.product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>

                        {/* Sélecteur de Quantité */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 bg-white rounded-lg overflow-hidden">
                            <button
                              id={`cart-qty-desc-${item.product.id}`}
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              disabled={item.quantity <= 1}
                              className="p-1 px-1.5 hover:bg-slate-50 text-slate-500 disabled:text-slate-200 disabled:hover:bg-transparent"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            
                            <span className="px-3 text-xs font-bold text-slate-700 min-w-6 text-center select-none">
                              {item.quantity}
                            </span>
                            
                            <button
                              id={`cart-qty-inc-${item.product.id}`}
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              disabled={isMaxReached}
                              className="p-1 px-1.5 hover:bg-slate-50 text-slate-500 disabled:text-slate-200 disabled:hover:bg-transparent"
                              title={isMaxReached ? "Limite de stock atteinte" : "Augmenter la quantité"}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Sous-total item */}
                          <span className="font-sans font-bold text-xs text-slate-800">
                            {itemSubtotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>
                        
                        {/* Alerte stock limite */}
                        {isMaxReached && (
                          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
                            Maximum disponible en stock
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer : Totaux & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                
                {/* Tableau récapitulatif */}
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Sous-total articles</span>
                    <span className="font-semibold text-slate-800">
                      {subtotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span>
                      Livraison Standard {isFreeShipping && <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-sm ml-1.5 uppercase text-[9px]">Offert</span>}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {isFreeShipping ? 'Gratuit' : shippingCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>

                  {!isFreeShipping && (
                    <div className="text-[11px] text-indigo-600 bg-indigo-50/50 p-2 rounded-lg text-center mt-1">
                      Ajoutez encore <span className="font-bold">{(freeShippingThreshold - subtotal).toFixed(2)}€</span> pour débloquer la <span className="font-semibold">livraison offerte</span> !
                    </div>
                  )}

                  <div className="border-t border-slate-200 my-2 pt-2 flex justify-between font-bold text-base text-slate-900 font-sans">
                    <span>Total TTC</span>
                    <span className="text-indigo-600">
                      {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                </div>

                {/* Bouton de Validation */}
                <button
                  id="checkout-trigger-btn"
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm tracking-wide py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-lg hover:shadow-indigo-100 active:scale-98 transition-all duration-200"
                >
                  Passer au paiement
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Simulation de paiement 100% sécurisée</span>
                </div>

              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
