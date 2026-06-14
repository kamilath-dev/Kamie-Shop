/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from './data';
import { Product, CartItem, Order, Category } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { Cart } from './components/Cart';
import { Wishlist } from './components/Wishlist';
import { Checkout } from './components/Checkout';
import { SkeletonLoader, DetailSkeletonLoader } from './components/Loader';
import { WhatsAppChat } from './components/WhatsAppChat';
import { Heart, Search, SlidersHorizontal, ArrowUpDown, Info } from 'lucide-react';
import { motion } from 'motion/react';

// Les catégories disponibles dans la boutique
const CATEGORIES: Category[] = ['Tous', 'Électronique', 'Mode', 'Maison & Déco', 'Livres & Papeterie'];

export default function App() {
  
  // ============================================
  // ÉTATS DE L'APPLICATION (REACT state vs VUE state)
  // En React, on utilise le hook useState.
  // En VueJS (Composition API), ce serait : const products = ref(MOCK_PRODUCTS);
  // ============================================
  
  // Stock simulé ajustable au cours de la session utilisateur
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Panier d'achats persisté dans localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ecoshop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Liste des favoris (IDs des produits) persistée dans localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ecoshop_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Vue ou Onglet actif : 'catalog' (boutique) ou 'wishlist' (favoris)
  const [activeTab, setActiveTab] = useState<'catalog' | 'wishlist'>('catalog');

  // ID du produit sélectionné (pour afficher sa page de détail complète)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Recherche textuelle
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrage par catégorie active
  const [activeCategory, setActiveCategory] = useState<Category>('Tous');

  // Option de tri : 'normal' | 'price-asc' | 'price-desc'
  const [sortBy, setSortBy] = useState<'normal' | 'price-asc' | 'price-desc'>('normal');

  // État d'ouverture/fermeture du rideau de panier coulissant
  const [isCartOpen, setIsCartOpen] = useState(false);

  // État d'affichage de la page de Checkout (formulaire de commande)
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Un faux état de chargement pour montrer les magnifiques Skeletons Loaders (chargement factice)
  const [isLoading, setIsLoading] = useState(false);

  // ============================================
  // EFFETS DE SAUVEGARDE & PERSISTANCE (React useEffect vs Vue watch)
  // En React, useEffect s'exécute quand ses dépendances changent.
  // En VueJS, on écrirait : watch(cartItems, (newVal) => { localStorage.setItem(...) }, { deep: true });
  // ============================================
  useEffect(() => {
    localStorage.setItem('ecoshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('ecoshop_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Déclencher un effet de chargement squelette très visuel quand la catégorie ou le tri change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450); // Simulation d'une latence d'API de 450ms
    return () => clearTimeout(timer);
  }, [activeCategory, sortBy]);

  // ============================================
  // ACTIONS / MÉTHODES (React callbacks vs Vue methods)
  // ============================================

  // Sélectionner un produit pour détailler ses caractéristiques
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsCheckingOut(false);
    // Fermer le panier pour mieux voir le détail
    setIsCartOpen(false);
  };

  // Basculer un produit dans les favoris
  const handleToggleFavorite = (productId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Ajouter un produit au panier
  const handleAddToCart = (product: Product) => {
    // 1. Vérification défensive : reste-t-il du stock ? (Gestion d'erreur demandée)
    if (product.stock <= 0) {
      alert("Désolé ! Cet article est actuellement victime de son succès et en rupture de stock.");
      return;
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      
      if (existing) {
        // Validation que l'on ne dépasse pas le stock maximal disponible
        if (existing.quantity >= product.stock) {
          alert(`Désolé, nous n'avons que ${product.stock} exemplaires de cet article en stock.`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });

    // Optionnel : Ouvrir le panier au premier ajout pour donner un feedback clair de l'action
    setIsCartOpen(true);
  };

  // Mettre à jour la quantité d'un article du panier
  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    // Ajuster l'inventaire par rapport aux limites de stock simulé
    const matchedProduct = products.find((p) => p.id === productId);
    if (!matchedProduct) return;

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item; // On gère la suppression via le bouton poubelle
          
          if (newQty > matchedProduct.stock) {
            alert(`Impossible d'ajouter plus. Notre stock actuel est de ${matchedProduct.stock} exemplaires.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  // Retirer un article du panier
  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // Confirmation de Commande terminée. Actions sur les stocks en direct suite à l'achat !
  const handleOrderCompleted = (completedOrder: Order) => {
    // On déduit les quantités achetées du stock physique simulé de notre session
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const orderedItem = completedOrder.items.find((item) => item.product.id === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        }
        return p;
      });
    });
  };

  // ============================================
  // CALCULS DE FILTRES ET TRI (Computed values)
  // Analogie VueJS : const filteredProducts = computed(() => ...)
  // ============================================
  const searchLower = searchQuery.toLowerCase();
  
  const filteredAndSortedProducts = products
    // 1. Filtrage par catégorie
    .filter((product) => activeCategory === 'Tous' || product.category === activeCategory)
    // 2. Filtrage par barre de recherche
    .filter((product) => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.shortDescription.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    })
    // 3. Tri
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return 0; // Tri naturel initial
    });

  // Obtenir les produits réels qui sont favoris
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  // Récupérer l'objet produit actif détaillé
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Composant Navbar d'En-tête */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={favoriteIds.length}
        searchTerm={searchQuery}
        setSearchTerm={(term) => {
          setSearchQuery(term);
          // Si on recherche et qu'on était perdu, on repasse sur l'onglet catalogue
          if (activeTab !== 'catalog') setActiveTab('catalog');
          if (selectedProductId) setSelectedProductId(null);
        }}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery(''); // Réinitialise la recherche lors du changement d'onglet
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onClearDetails={() => setSelectedProductId(null)}
      />

      {/* Contenu Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* BANDEAU DÉBUTANT : Info pédagogique sur le TP */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100/50 rounded-2xl p-4.5 mb-8 text-xs text-indigo-950 flex items-start gap-3 shadow-xs">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold font-sans text-[13px] text-indigo-950">Bienvenue sur votre TP E-Commerce pédagogique !</h4>
            <p className="leading-relaxed text-slate-600">
              Chaque ligne de code de cette plateforme a été commentée pour faire la correspondance directe entre <strong className="text-indigo-700">React</strong> et votre intérêt pour <strong className="text-indigo-700">VueJS</strong> ! Lisez les fichiers <code className="bg-indigo-100/60 px-1 py-0.5 rounded-sm font-semibold">types.ts</code>, <code className="bg-indigo-100/60 px-1 py-0.5 rounded-sm font-semibold">Header.tsx</code> ou <code className="bg-indigo-100/60 px-1 py-0.5 rounded-sm font-semibold">App.tsx</code> pour en assimiler tous les concepts clés (gestion des états réactifs, props, listes de boucles et événements).
            </p>
          </div>
        </div>

        {/* AFFICHAGE CONDITIONNEL DES PAGES */}
        
        {/* CAS A : PAGE DE CHECKOUT COMMANDE */}
        {isCheckingOut ? (
          <Checkout
            cartItems={cartItems}
            onOrderCompleted={handleOrderCompleted}
            onBackToCart={() => {
              setIsCheckingOut(false);
              setIsCartOpen(true); // Ouvre le panier pour retourner là
            }}
            onClearCart={() => setCartItems([])}
            onNavigateHome={() => {
              setIsCheckingOut(false);
              setSelectedProductId(null);
              setActiveTab('catalog');
            }}
          />
        ) : (
          /* CAS B : PRODUIT EN DÉTAIL */
          selectedProduct ? (
            <div className="max-w-4xl mx-auto">
              <ProductDetails
                product={selectedProduct}
                isFavorite={favoriteIds.includes(selectedProduct.id)}
                onToggleFavorite={() => handleToggleFavorite(selectedProduct.id)}
                onAddToCart={() => handleAddToCart(selectedProduct)}
                onBack={() => setSelectedProductId(null)}
              />
            </div>
          ) : (
            /* CAS C : LISTE WISHLIST FAVORIS */
            activeTab === 'wishlist' ? (
              <Wishlist
                favoriteProducts={favoriteProducts}
                onRemoveFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                onSelectProduct={(prod) => handleSelectProduct(prod.id)}
                onNavigateToCatalog={() => setActiveTab('catalog')}
              />
            ) : (
              /* CAS D : CATALOGUE BOUTIQUE STANDARD */
              <div className="space-y-8">
                
                {/* Section Filtres de catégories et Options de Tri */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs">
                  
                  {/* Catégories de produit */}
                  <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        id={`category-btn-${cat}`}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                          activeCategory === cat
                            ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-100'
                            : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Tri par Prix */}
                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-3.5 md:pt-0 border-slate-100 h-full shrink-0">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Trier par :</span>
                    <select
                      id="sort-select-box"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-50 text-slate-600 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="normal">Pertinence (Défaut)</option>
                      <option value="price-asc">Prix : croissant ↗</option>
                      <option value="price-desc">Prix : décroissant ↘</option>
                    </select>
                  </div>

                </div>

                {/* Filtres de recherche actifs affichés en retour */}
                {(activeCategory !== 'Tous' || searchQuery) && (
                  <div className="flex items-center justify-between bg-slate-100/50 p-3 rounded-xl text-xs">
                    <p className="text-slate-600">
                      Filtre actif : {activeCategory !== 'Tous' && <strong>{activeCategory}</strong>}
                      {searchQuery && (
                        <span> {activeCategory !== 'Tous' && '&'} recherche de "<strong>{searchQuery}</strong>"</span>
                      )}
                      <span> ({filteredAndSortedProducts.length} résultat{filteredAndSortedProducts.length > 1 && 's'})</span>
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory('Tous');
                        setSearchQuery('');
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      Tout réinitialiser
                    </button>
                  </div>
                )}

                {/* Grille de Produits avec animation ou Skeleton Loader */}
                {isLoading ? (
                  /* Affichage du squelette lors des filtres ou tris */
                  <SkeletonLoader count={8} />
                ) : filteredAndSortedProducts.length === 0 ? (
                  /* Message d'erreur de recherche vide */
                  <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
                    <Search className="w-10 h-10 text-slate-300 mx-auto" />
                    <div>
                      <h3 className="font-sans font-bold text-slate-700">Aucun produit ne correspond</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-normal">
                        Nous n’avons pas trouvé d'articles concordant avec votre recherche. Essayez d'orienter vos mots-clés autrement ou de changer de catégorie !
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('Tous');
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                    >
                      Voir tous les produits
                    </button>
                  </div>
                ) : (
                  /* Rendu réel de la boutique d'articles */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favoriteIds.includes(product.id)}
                        onToggleFavorite={() => handleToggleFavorite(product.id)}
                        onAddToCart={() => handleAddToCart(product)}
                        onClick={() => handleSelectProduct(product.id)}
                      />
                    ))}
                  </div>
                )}

              </div>
            )
          )
        )}

      </main>

      {/* Rideau du Tiroir de Panier */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCheckingOut(true);
          setSelectedProductId(null); // Quitte l'écran de détail s'il était ouvert
        }}
      />

      {/* Footer minimaliste, élégant et soigné */}
      <footer className="bg-white border-t border-slate-100 py-8 mt-12 text-center text-xs text-slate-400 font-medium">
        <p>© 2026 ÉcoShop Mini. Code source modulaire optimisé pour l'apprentissage.</p>
        <p className="mt-1 text-[10px] text-slate-300">Construit avec React v19, Tailwind CSS v4, TypeScript et Lucide.</p>
      </footer>

      {/* Assistant WhatsApp Chatbot Intuitif */}
      <WhatsAppChat />

    </div>
  );
}
