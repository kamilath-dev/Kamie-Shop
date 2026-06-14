/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartItem, CheckoutForm, Order } from '../types';
import { CheckCircle2, CreditCard, ShoppingBag, ArrowLeft, Loader2, Sparkles, Phone, MapPin, User } from 'lucide-react';
import { motion } from 'motion/react';

// Props pour le composant de Checkout.
interface CheckoutProps {
  cartItems: CartItem[];
  onOrderCompleted: (order: Order) => void;
  onBackToCart: () => void;
  onClearCart: () => void;
  onNavigateHome: () => void;
}

export function Checkout({
  cartItems,
  onOrderCompleted,
  onBackToCart,
  onClearCart,
  onNavigateHome,
}: CheckoutProps) {
  
  // États de notre formulaire pour la checkout.
  // Analogie VueJS : Un objet réactif : const form = reactive({ name: '', address: '', phone: '' })
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    address: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [checkoutState, setCheckoutState] = useState<'form' | 'submitting' | 'success'>('form');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 50.00;
  const shippingCost = isFreeShipping ? 0 : 4.90;
  const total = subtotal + shippingCost;

  // Gestion des changements du formulaire.
  // Analogie VueJS : Gérée nativement par v-model="form.name".
  // En React, nous mettons à jour l'état explicitement via une fonction.
  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validation du formulaire de commande
  const validateForm = (): boolean => {
    const tempErrors: Partial<CheckoutForm> = {};
    if (!formData.name.trim()) tempErrors.name = 'Le nom complet est obligatoire';
    if (!formData.address.trim()) tempErrors.address = 'L’adresse de livraison est essentielle';
    
    // Filtre simple de téléphone (ex: minimum 8 chiffres)
    const phoneRegex = /^[0-9+\s()-.]{8,20}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Le numéro de téléphone est obligatoire';
    } else if (!phoneRegex.test(formData.phone)) {
      tempErrors.phone = 'Le format du téléphone n’est pas valide (min. 8 chiffres)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Gestion de la soumission de commande
  // Analogie VueJS : <form @submit.prevent="handleSubmit">...
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulation de l'appel API avec un court chargement
    setCheckoutState('submitting');
    
    setTimeout(() => {
      const newOrder: Order = {
        id: `CMD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cartItems],
        total: total,
        customerInfo: formData,
        date: new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setCompletedOrder(newOrder);
      setCheckoutState('success');
      onOrderCompleted(newOrder);
      onClearCart(); // On vide le panier après le succès!
    }, 1500); // 1.5 seconde de temps de chargement fictif
  };

  // ÉCRAN 1 : FORMULAIRE DE CHÉCKE-OUT ET RÉCAPITULATIF
  if (checkoutState === 'form') {
    return (
      <div id="checkout-view" className="space-y-6">
        <div>
          <button
            id="checkout-back-btn"
            onClick={onBackToCart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Modifier mes achats
          </button>
          
          <h1 className="font-sans font-extrabold text-2xl lg:text-3xl text-slate-900 tracking-tight mt-3">
            Finaliser ma commande
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Bloc Formulaire (7 cols) */}
          <form 
            id="checkout-form-blocks"
            onSubmit={handleSubmit} 
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 lg:p-8 shadow-xs space-y-6"
          >
            <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="font-sans font-bold text-base text-slate-800">1. Informations de Livraison</h2>
            </div>

            {/* Champ Nom */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="checkout-input-name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full bg-slate-50 pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-hidden focus:bg-white transition-all text-slate-800 ${
                    errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name}</p>}
            </div>

            {/* Champ Adresse */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">
                Adresse de livraison exacte
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3.5 flex items-start pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  id="checkout-input-address"
                  rows={3}
                  placeholder="12 Ruelle des Marguerites, 75001 Paris"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full bg-slate-50 pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-hidden focus:bg-white transition-all text-slate-800 ${
                    errors.address ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.address && <p className="text-xs text-rose-500 font-medium">{errors.address}</p>}
            </div>

            {/* Champ Téléphone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">
                Numéro de téléphone portable
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="checkout-input-phone"
                  type="text"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full bg-slate-50 pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-hidden focus:bg-white transition-all text-slate-800 ${
                    errors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-rose-500 font-medium">{errors.phone}</p>}
            </div>

            <div className="pt-4">
              <button
                id="checkout-submit-btn"
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm tracking-wide py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-lg hover:shadow-indigo-100 active:scale-98 transition-all"
              >
                Confirmer & Payer {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </button>
            </div>
          </form>

          {/* Bloc Récapitulatif Panier (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="font-sans font-bold text-sm text-slate-800">2. Récapitulatif de vos achats</h2>
            </div>

            {/* Liste d'articles miniatures */}
            <div className="max-h-72 overflow-y-auto pr-1 space-y-3">
              {cartItems.map((item) => (
                <div key={`check-${item.product.id}`} className="flex items-center gap-3.5 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="w-11 h-11 bg-slate-50 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <img
                      src={item.product.mainImage}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-800 font-semibold text-xs truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-slate-400">Qté : {item.quantity} x {item.product.price.toFixed(2)}€</p>
                  </div>
                  <span className="font-semibold text-slate-700 text-xs text-right">
                    {(item.product.price * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>

            {/* Grille totaux */}
            <div className="bg-slate-50/70 rounded-xl p-4 space-y-2 mt-4 text-xs text-slate-600 border border-slate-100">
              <div className="flex justify-between">
                <span>Sous-total articles</span>
                <span className="font-medium text-slate-800">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span className="font-medium text-slate-800">{isFreeShipping ? 'Gratuit' : `${shippingCost.toFixed(2)} €`}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total à régler</span>
                <span className="text-indigo-600">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ÉCRAN 2 : CHARGEMENT EN COURS (SIMULATION BANCAIRE)
  if (checkoutState === 'submitting') {
    return (
      <div 
        id="submitting-spinner-loading"
        className="max-w-md mx-auto bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-6 shrink-0 my-12"
      >
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center relative animate-pulse">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <div>
          <h2 className="font-sans font-bold text-slate-800 text-lg">Simulation du paiement</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed mx-auto">
            Veuillez ne pas fermer cette fenêtre. Nous vérifions les autorisations bancaires fictives et réservons vos articles...
          </p>
        </div>
      </div>
    );
  }

  // ÉCRAN 3 : CONFIRMATION DE COMMANDE AVEC SUCCÈS
  return (
    <div 
      id="checkout-success-panel"
      className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 my-4"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          Commande validée avec succès !
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Félicitations, votre commande fictive a bien été enregistrée. C'est l'exercice parfait d'un fonctionnement e-commerce côté client !
        </p>
      </div>

      {completedOrder && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Référence Commande</span>
              <span className="font-sans font-bold text-sm text-indigo-600">{completedOrder.id}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider text-left sm:text-right">Date de Commande</span>
              <span className="font-semibold text-slate-700 text-xs block text-left sm:text-right">{completedOrder.date}</span>
            </div>
          </div>

          {/* Destinataire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">Destinataire</span>
              <span className="font-semibold text-slate-800 block">{completedOrder.customerInfo.name}</span>
              <span className="text-slate-500">{completedOrder.customerInfo.phone}</span>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">Adresse finale</span>
              <span className="text-slate-600 leading-normal block">{completedOrder.customerInfo.address}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-sans">
            <span className="font-bold text-slate-900">Montant total réglé</span>
            <span className="font-extrabold text-indigo-600 text-base">{completedOrder.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
          </div>
        </div>
      )}

      {/* Alerte et rappel */}
      <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-800">
        <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <h4 className="font-bold">Estimation de livraison</h4>
          <p>
            Étant donné qu'il s'agit d'une simulation frontend pure, notre transporteur légendaire (fictif) livrera vos produits chez vous d'ici <strong>3 à 5 jours ouvrés</strong> ! 🎉
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          id="success-home-btn"
          onClick={onNavigateHome}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm py-3 px-6 rounded-xl text-center active:scale-98 transition-all"
        >
          Retour au catalogue
        </button>
      </div>

    </div>
  );
}
