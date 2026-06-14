/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Ces types d'objets aident à documenter et sécuriser notre code.
// C'est l'un des grands avantages de TypeScript, utilisé aussi bien en VueJS qu'en React !

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  shortDescription: string;
  description: string;
  mainImage: string;
  gallery: string[];
  stock: number;
  rating: number; // exemple: 4.5
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutForm {
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CheckoutForm;
  date: string;
}

export type Category = 'Tous' | 'Électronique' | 'Mode' | 'Maison & Déco' | 'Livres & Papeterie';
