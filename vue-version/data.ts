/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Casque Audio Premium ANC',
    price: 189.99,
    category: 'Électronique',
    shortDescription: 'Casque sans fil avec réduction de bruit active d’exception et confort longue durée.',
    description: 'Vivez une immersion sonore totale avec notre casque premium. Il dispose d’une réduction active de bruit hybride de pointe, de transducteurs de 40mm pour des basses ultra-profondes et d’une autonomie exceptionnelle de 45 heures. Les coussinets en mousse à mémoire de forme garantissent un confort parfait, même pendant de longues sessions d’écoute. Idéal pour le voyage, le travail ou la détente quotidienne.',
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 5,
    rating: 4.8
  },
  {
    id: 'prod-2',
    name: 'Montre Connectée Active',
    price: 129.50,
    category: 'Électronique',
    shortDescription: 'Suivi bien-être complet, GPS intégré et notifications intelligentes au poignet.',
    description: 'La montre connectée indispensable pour votre quotidien dynamique. Équipée d’un écran AMOLED haute définition, elle suit vos activités physiques (plus de 30 sports pris en charge), analyse votre sommeil, mesure votre fréquence cardiaque en continu et calcule votre taux d’oxygène dans le sang. Entièrement étanche, elle possède une autonomie de 7 jours et se synchronise facilement avec Android et iOS.',
    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 8,
    rating: 4.5
  },
  {
    id: 'prod-3',
    name: 'Cafetière Express Compacte',
    price: 89.00,
    category: 'Maison & Déco',
    shortDescription: 'Préparez des espressos parfaits et crémeux en quelques secondes.',
    description: 'Compacte et élégante, cette cafetière s’intègre à toutes les cuisines. Avec sa pompe haute pression de 15 bars, elle extrait les arômes les plus riches de votre café. Elle propose un système de chauffe rapide, une buse vapeur orientable pour des cappuccinos à la mousse onctueuse, et un réservoir d’eau amovible de 1,2 Litre pour un entretien simplifié au quotidien.',
    mainImage: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0ca6?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517256064527-09c53b2d0ca6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 0,
    rating: 4.2
  },
  {
    id: 'prod-4',
    name: 'Sac à Dos Aventurier',
    price: 65.00,
    category: 'Mode',
    shortDescription: 'Sac imperméable avec compartiment PC renforcé, idéal pour le travail ou le week-end.',
    description: 'Affrontez les métropoles et la nature confortablement. Ce sac à dos de 25L est fabriqué en tissu éco-conçu imperméable haute densité. Il intègre un compartiment matelassé pour ordinateur de 15,6 pouces, de multiples poches intérieures d’organisation et des bandes réfléchissantes de sécurité. Son dos respirant protège votre posture pendant de longs trajets.',
    mainImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1575844621280-d66491873ab3?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 12,
    rating: 4.6
  },
  {
    id: 'prod-5',
    name: 'Baskets Urbaines Éco',
    price: 95.00,
    category: 'Mode',
    shortDescription: 'Baskets légères, respirantes et entièrement conçues en matériaux recyclés.',
    description: 'Une alliance de style et d’éthique pour vos pieds. Nos baskets urbaines sont fabriquées à partir de plastiques océaniques recyclés et de caoutchouc naturel biodégradable. Offrant un amorti souple et une légèreté incroyable, elles s’accordent avec toutes vos tenues tout en prenant soin de la planète.',
    mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 4,
    rating: 4.7
  },
  {
    id: 'prod-6',
    name: 'Carnet de Notes & Stylo Minimaliste',
    price: 24.90,
    category: 'Livres & Papeterie',
    shortDescription: 'Ensemble élégant comprenant un carnet papier fort et un stylo à bille gel fluide.',
    description: 'Écrivez vos rêves, projets ou notes d’études dans ce magnifique carnet de 160 pages lignées. Papier 120g de haute qualité sans acide pour éviter les bavures d’encre. Accompagné d’un stylo de design minimaliste en aluminium rechargeable offrant un tracé extra-fluide de couleur noire.',
    mainImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 20,
    rating: 4.4
  },
  {
    id: 'prod-7',
    name: 'Lampe de Bureau LED Articulée',
    price: 45.00,
    category: 'Maison & Déco',
    shortDescription: 'Changement de couleur, contrôle tactile et port de charge USB pratique.',
    description: 'Illuminez votre bureau de manière intelligente. Cette lampe propose 5 modes de température de couleur (chaud à froid) et 10 niveaux de luminosité tactiles. Son bras articulé permet de diriger précisément le flux lumineux sans éblouir les yeux, et son port USB arrière charge rapidement vos appareils mobiles.',
    mainImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 6,
    rating: 4.3
  },
  {
    id: 'prod-8',
    name: 'Gourde Isotherme Tout-Terrain',
    price: 29.99,
    category: 'Maison & Déco',
    shortDescription: 'Garde vos boissons froides 24h ou chaudes 12h, double paroi étanche.',
    description: 'Une gourde en acier inoxydable de qualité alimentaire, garantie sans BPA. Elle utilise une technologie de vide d’air double paroi d’isolation pour éviter la condensation extérieure et préserver la température exacte de votre boisson pendant des heures. Bouchon équipé de joints hermétiques étanches innovants.',
    mainImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589362483830-878f14139bca?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 15,
    rating: 4.5
  }
];
