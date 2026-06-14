/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Heart, Search, Store } from 'lucide-react';
import { motion } from 'motion/react';

// En React, on déclare les propriétés reçues du parent via une interface TypeScript (Props).
// En VueJS, cela équivaut à la macro defineProps({ ... }).
interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeTab: 'catalog' | 'wishlist';
  setActiveTab: (tab: 'catalog' | 'wishlist') => void;
  onOpenCart: () => void;
  onClearDetails: () => void;
}

export function Header({
  cartCount,
  wishlistCount,
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  onOpenCart,
  onClearDetails,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo - Clic dessus réinitialise la vue principale */}
          <div 
            id="logo-brand"
            className="flex items-center gap-2 cursor-pointer select-none group"
            onClick={() => {
              onClearDetails();
              setActiveTab('catalog');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
              ÉcoShop <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block sm:inline sm:ml-1">Mini</span>
            </span>
          </div>

          {/* Recherche par mot-clé */}
          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="search-input"
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Boutons d'interaction : Wishlist & Panier */}
          <div className="flex items-center gap-3">
            
            {/* Wishlist Button - Active l'onglet correspond */}
            <button
              id="wishlist-nav-btn"
              onClick={() => {
                onClearDetails();
                setActiveTab('wishlist');
              }}
              className={`p-2.5 rounded-xl border relative transition-all duration-200 ${
                activeTab === 'wishlist'
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800'
              }`}
              title="Voir mes favoris"
            >
              <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'fill-indigo-600' : ''}`} />
              
              {wishlistCount > 0 && (
                <motion.span
                  key={`wishlist-badge-${wishlistCount}`}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </button>

            {/* Cart Button - Ouvre le tiroir latéral */}
            <button
              id="cart-nav-btn"
              onClick={onOpenCart}
              className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 relative transition-all duration-200"
              title="Ouvrir le panier"
            >
              <ShoppingBag className="w-5 h-5" />
              
              {cartCount > 0 && (
                <motion.span
                  key={`cart-badge-${cartCount}`}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
