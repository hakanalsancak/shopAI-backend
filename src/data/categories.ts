// ===========================================
// Product Categories & Question Flows
// Complete category tree with structured questions
// ===========================================

import { Category, Question } from '../types';

// ===========================================
// Shared Question Templates
// ===========================================

const budgetQuestion = (currency: string, maxBudget: number): Question => ({
  id: 'budget',
  text: 'What\'s your budget range?',
  type: 'range',
  required: true,
  rangeConfig: {
    min: 0,
    max: maxBudget,
    step: currency === 'GBP' ? 50 : 50,
    currency: currency,
    presets: currency === 'GBP' ? [
      { label: 'Under £100', min: 0, max: 100 },
      { label: '£100 - £300', min: 100, max: 300 },
      { label: '£300 - £500', min: 300, max: 500 },
      { label: '£500 - £1000', min: 500, max: 1000 },
      { label: 'Over £1000', min: 1000, max: maxBudget },
    ] : [
      { label: 'Under $100', min: 0, max: 100 },
      { label: '$100 - $300', min: 100, max: 300 },
      { label: '$300 - $500', min: 300, max: 500 },
      { label: '$500 - $1000', min: 500, max: 1000 },
      { label: 'Over $1000', min: 1000, max: maxBudget },
    ],
  },
});

const prioritiesQuestion = (options: { id: string; label: string }[]): Question => ({
  id: 'priorities',
  text: 'What matters most to you? (Select up to 3)',
  type: 'multi_select',
  required: true,
  options: options.map(o => ({ ...o, value: o.id })),
});

// ===========================================
// Categories Definition
// ===========================================

export const getCategories = (currency: string = 'GBP'): Category[] => [
  // =====================
  // ELECTRONICS & COMPUTERS
  // =====================
  {
    id: 'electronics',
    name: 'Electronics & Computers',
    icon: 'laptopcomputer',
    description: 'Phones, laptops, tablets & more',
    subcategories: [
      {
        id: 'phones',
        name: 'Smartphones',
        icon: 'iphone',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'brand',
              text: 'Do you have a preferred brand?',
              type: 'single_select',
              required: false,
              options: [
                { id: 'any', label: 'No preference', value: 'any' },
                { id: 'apple', label: 'Apple', value: 'Apple' },
                { id: 'samsung', label: 'Samsung', value: 'Samsung' },
                { id: 'google', label: 'Google Pixel', value: 'Google' },
                { id: 'oneplus', label: 'OnePlus', value: 'OnePlus' },
                { id: 'xiaomi', label: 'Xiaomi', value: 'Xiaomi' },
              ],
            },
            budgetQuestion(currency, 2000),
            prioritiesQuestion([
              { id: 'camera', label: 'Camera quality' },
              { id: 'battery', label: 'Battery life' },
              { id: 'performance', label: 'Performance' },
              { id: 'display', label: 'Display quality' },
              { id: 'value', label: 'Value for money' },
              { id: 'compact', label: 'Compact size' },
            ]),
            {
              id: 'usage',
              text: 'Primary use case?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'general', label: 'General use', value: 'general' },
                { id: 'photography', label: 'Photography', value: 'photography' },
                { id: 'gaming', label: 'Mobile gaming', value: 'gaming' },
                { id: 'business', label: 'Business', value: 'business' },
              ],
            },
          ],
        },
      },
      {
        id: 'laptops',
        name: 'Laptops',
        icon: 'laptopcomputer',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'brand',
              text: 'Preferred brand?',
              type: 'single_select',
              required: false,
              options: [
                { id: 'any', label: 'No preference', value: 'any' },
                { id: 'apple', label: 'Apple MacBook', value: 'Apple MacBook' },
                { id: 'dell', label: 'Dell', value: 'Dell' },
                { id: 'hp', label: 'HP', value: 'HP' },
                { id: 'lenovo', label: 'Lenovo', value: 'Lenovo' },
                { id: 'asus', label: 'ASUS', value: 'ASUS' },
              ],
            },
            budgetQuestion(currency, 3000),
            prioritiesQuestion([
              { id: 'performance', label: 'Performance' },
              { id: 'portability', label: 'Portability' },
              { id: 'battery', label: 'Battery life' },
              { id: 'display', label: 'Display quality' },
              { id: 'build', label: 'Build quality' },
              { id: 'value', label: 'Value for money' },
            ]),
            {
              id: 'usage',
              text: 'What will you mainly use it for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'general', label: 'General use & browsing', value: 'general' },
                { id: 'work', label: 'Work & productivity', value: 'work' },
                { id: 'creative', label: 'Creative work (video, design)', value: 'creative' },
                { id: 'gaming', label: 'Gaming', value: 'gaming' },
                { id: 'coding', label: 'Programming', value: 'coding' },
              ],
            },
          ],
        },
      },
      {
        id: 'tablets',
        name: 'Tablets',
        icon: 'ipad',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'brand',
              text: 'Preferred brand?',
              type: 'single_select',
              required: false,
              options: [
                { id: 'any', label: 'No preference', value: 'any' },
                { id: 'apple', label: 'Apple iPad', value: 'Apple iPad' },
                { id: 'samsung', label: 'Samsung Galaxy Tab', value: 'Samsung Galaxy Tab' },
                { id: 'amazon', label: 'Amazon Fire', value: 'Amazon Fire' },
              ],
            },
            budgetQuestion(currency, 1500),
            prioritiesQuestion([
              { id: 'display', label: 'Display quality' },
              { id: 'performance', label: 'Performance' },
              { id: 'portability', label: 'Portability' },
              { id: 'stylus', label: 'Stylus support' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'headphones',
        name: 'Headphones',
        icon: 'headphones',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of headphones?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'overear', label: 'Over-ear', value: 'over-ear' },
                { id: 'onear', label: 'On-ear', value: 'on-ear' },
                { id: 'inear', label: 'In-ear / Earbuds', value: 'earbuds' },
              ],
            },
            {
              id: 'wireless',
              text: 'Wireless preference?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'wireless', label: 'Wireless (Bluetooth)', value: 'wireless' },
                { id: 'wired', label: 'Wired', value: 'wired' },
                { id: 'any', label: 'No preference', value: 'any' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion([
              { id: 'sound', label: 'Sound quality' },
              { id: 'anc', label: 'Noise cancellation' },
              { id: 'comfort', label: 'Comfort' },
              { id: 'battery', label: 'Battery life' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'smartwatches',
        name: 'Smartwatches',
        icon: 'applewatch',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'phone',
              text: 'What phone do you use?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'iphone', label: 'iPhone', value: 'iPhone' },
                { id: 'android', label: 'Android', value: 'Android' },
              ],
            },
            budgetQuestion(currency, 800),
            prioritiesQuestion([
              { id: 'fitness', label: 'Fitness tracking' },
              { id: 'battery', label: 'Battery life' },
              { id: 'design', label: 'Design & style' },
              { id: 'health', label: 'Health features' },
              { id: 'apps', label: 'App ecosystem' },
            ]),
          ],
        },
      },
    ],
  },

  // =====================
  // HOME, GARDEN & DIY
  // =====================
  {
    id: 'home',
    name: 'Home, Garden & DIY',
    icon: 'house.fill',
    description: 'Appliances, furniture & decor',
    subcategories: [
      {
        id: 'vacuum',
        name: 'Vacuum Cleaners',
        icon: 'fan.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of vacuum?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'cordless', label: 'Cordless stick', value: 'cordless stick' },
                { id: 'robot', label: 'Robot vacuum', value: 'robot' },
                { id: 'upright', label: 'Upright', value: 'upright' },
                { id: 'canister', label: 'Canister', value: 'canister' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion([
              { id: 'suction', label: 'Suction power' },
              { id: 'battery', label: 'Battery life' },
              { id: 'quiet', label: 'Quiet operation' },
              { id: 'pet', label: 'Pet hair performance' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'coffee',
        name: 'Coffee Machines',
        icon: 'cup.and.saucer.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of coffee machine?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'bean', label: 'Bean-to-cup', value: 'bean to cup' },
                { id: 'pod', label: 'Pod/Capsule', value: 'pod capsule' },
                { id: 'espresso', label: 'Espresso machine', value: 'espresso machine' },
                { id: 'filter', label: 'Filter/Drip', value: 'filter drip' },
              ],
            },
            budgetQuestion(currency, 1500),
            prioritiesQuestion([
              { id: 'quality', label: 'Coffee quality' },
              { id: 'ease', label: 'Ease of use' },
              { id: 'speed', label: 'Speed' },
              { id: 'milk', label: 'Milk frothing' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'airfryer',
        name: 'Air Fryers',
        icon: 'flame.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'size',
              text: 'What size do you need?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'small', label: 'Small (1-2 people)', value: 'small compact' },
                { id: 'medium', label: 'Medium (3-4 people)', value: 'medium family' },
                { id: 'large', label: 'Large (5+ people)', value: 'large xl' },
              ],
            },
            budgetQuestion(currency, 400),
            prioritiesQuestion([
              { id: 'capacity', label: 'Capacity' },
              { id: 'features', label: 'Extra features' },
              { id: 'easy', label: 'Easy to clean' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
    ],
  },

  // =====================
  // HEALTH & BEAUTY
  // =====================
  {
    id: 'beauty',
    name: 'Health & Beauty',
    icon: 'heart.fill',
    description: 'Skincare, makeup & grooming',
    subcategories: [
      {
        id: 'skincare',
        name: 'Skincare',
        icon: 'drop.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'concern',
              text: 'What\'s your main skin concern?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'acne', label: 'Acne & breakouts', value: 'acne treatment' },
                { id: 'aging', label: 'Anti-aging', value: 'anti-aging' },
                { id: 'hydration', label: 'Hydration', value: 'hydrating moisturizing' },
                { id: 'brightening', label: 'Brightening', value: 'brightening vitamin c' },
                { id: 'sensitivity', label: 'Sensitivity', value: 'sensitive skin' },
              ],
            },
            {
              id: 'skintype',
              text: 'What\'s your skin type?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'oily', label: 'Oily', value: 'oily skin' },
                { id: 'dry', label: 'Dry', value: 'dry skin' },
                { id: 'combo', label: 'Combination', value: 'combination skin' },
                { id: 'normal', label: 'Normal', value: 'normal skin' },
              ],
            },
            budgetQuestion(currency, 200),
          ],
        },
      },
      {
        id: 'haircare',
        name: 'Hair Care & Styling',
        icon: 'comb.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'dryer', label: 'Hair dryer', value: 'hair dryer' },
                { id: 'straightener', label: 'Straightener', value: 'hair straightener' },
                { id: 'curler', label: 'Curling iron', value: 'curling iron' },
                { id: 'styler', label: 'Multi-styler', value: 'hair styler airwrap' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion([
              { id: 'results', label: 'Styling results' },
              { id: 'damage', label: 'Hair protection' },
              { id: 'speed', label: 'Speed' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
    ],
  },

  // =====================
  // SPORTS & OUTDOORS
  // =====================
  {
    id: 'fitness',
    name: 'Sports & Outdoors',
    icon: 'figure.run',
    description: 'Exercise equipment & sportswear',
    subcategories: [
      {
        id: 'homegym',
        name: 'Home Gym Equipment',
        icon: 'dumbbell.fill',
        categoryId: 'fitness',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What equipment are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'weights', label: 'Dumbbells/Weights', value: 'dumbbells weights' },
                { id: 'bench', label: 'Weight bench', value: 'weight bench' },
                { id: 'rack', label: 'Power rack', value: 'power rack squat' },
                { id: 'cardio', label: 'Cardio machine', value: 'treadmill exercise bike' },
              ],
            },
            budgetQuestion(currency, 2000),
            prioritiesQuestion([
              { id: 'quality', label: 'Build quality' },
              { id: 'compact', label: 'Space-saving' },
              { id: 'versatility', label: 'Versatility' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'running',
        name: 'Running Shoes',
        icon: 'shoe.fill',
        categoryId: 'fitness',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of running?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'road', label: 'Road running', value: 'road running shoes' },
                { id: 'trail', label: 'Trail running', value: 'trail running shoes' },
                { id: 'track', label: 'Track/Racing', value: 'racing shoes' },
                { id: 'casual', label: 'Casual/Gym', value: 'training shoes' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion([
              { id: 'cushion', label: 'Cushioning' },
              { id: 'support', label: 'Support' },
              { id: 'lightweight', label: 'Lightweight' },
              { id: 'durability', label: 'Durability' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
    ],
  },

  // =====================
  // TOYS, CHILDREN & BABY
  // =====================
  {
    id: 'toys',
    name: 'Toys, Children & Baby',
    icon: 'teddybear.fill',
    description: 'For kids & adults',
    subcategories: [
      {
        id: 'kidstoys',
        name: 'Kids Toys',
        icon: 'teddybear.fill',
        categoryId: 'toys',
        questionFlow: {
          questions: [
            {
              id: 'age',
              text: 'Child\'s age group?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'toddler', label: '1-3 years', value: 'toddler toys 1-3' },
                { id: 'preschool', label: '3-5 years', value: 'preschool toys 3-5' },
                { id: 'kids', label: '5-8 years', value: 'kids toys 5-8' },
                { id: 'tweens', label: '8-12 years', value: 'tween toys 8-12' },
              ],
            },
            {
              id: 'type',
              text: 'Type of toy?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'educational', label: 'Educational/STEM', value: 'educational STEM' },
                { id: 'creative', label: 'Creative/Art', value: 'creative art craft' },
                { id: 'active', label: 'Active/Outdoor', value: 'outdoor active' },
                { id: 'building', label: 'Building/Construction', value: 'building blocks LEGO' },
              ],
            },
            budgetQuestion(currency, 200),
          ],
        },
      },
      {
        id: 'videogames',
        name: 'Video Games',
        icon: 'gamecontroller.fill',
        categoryId: 'toys',
        questionFlow: {
          questions: [
            {
              id: 'platform',
              text: 'Which platform?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'ps5', label: 'PlayStation 5', value: 'PS5 PlayStation 5' },
                { id: 'xbox', label: 'Xbox Series X/S', value: 'Xbox Series' },
                { id: 'switch', label: 'Nintendo Switch', value: 'Nintendo Switch' },
                { id: 'pc', label: 'PC', value: 'PC gaming' },
              ],
            },
            {
              id: 'genre',
              text: 'Preferred genre?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'action', label: 'Action/Adventure', value: 'action adventure' },
                { id: 'rpg', label: 'RPG', value: 'RPG role playing' },
                { id: 'sports', label: 'Sports/Racing', value: 'sports racing' },
                { id: 'family', label: 'Family/Party', value: 'family party' },
              ],
            },
            budgetQuestion(currency, 100),
          ],
        },
      },
    ],
  },

  // =====================
  // CLOTHES, SHOES & WATCHES
  // =====================
  {
    id: 'fashion',
    name: 'Clothes, Shoes & Watches',
    icon: 'tshirt.fill',
    description: 'Clothing, shoes & accessories',
    subcategories: [
      {
        id: 'watches',
        name: 'Watches',
        icon: 'clock.fill',
        categoryId: 'fashion',
        questionFlow: {
          questions: [
            {
              id: 'style',
              text: 'What style are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'dress', label: 'Dress/Formal', value: 'dress watch formal' },
                { id: 'casual', label: 'Casual/Everyday', value: 'casual watch' },
                { id: 'sport', label: 'Sport/Diving', value: 'sport dive watch' },
                { id: 'smart', label: 'Smartwatch', value: 'smartwatch' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion([
              { id: 'design', label: 'Design/Aesthetics' },
              { id: 'quality', label: 'Build quality' },
              { id: 'brand', label: 'Brand prestige' },
              { id: 'features', label: 'Features' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'bags',
        name: 'Bags & Backpacks',
        icon: 'bag.fill',
        categoryId: 'fashion',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of bag?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'backpack', label: 'Backpack', value: 'backpack' },
                { id: 'laptop', label: 'Laptop bag', value: 'laptop bag' },
                { id: 'travel', label: 'Travel/Duffel', value: 'travel duffel bag' },
                { id: 'crossbody', label: 'Crossbody/Messenger', value: 'crossbody messenger' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion([
              { id: 'capacity', label: 'Capacity' },
              { id: 'durability', label: 'Durability' },
              { id: 'comfort', label: 'Comfort' },
              { id: 'style', label: 'Style' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
    ],
  },
];

// ===========================================
// Helper Functions
// ===========================================

export function getCategoryById(categories: Category[], categoryId: string): Category | undefined {
  return categories.find(c => c.id === categoryId);
}

export function getSubcategoryById(categories: Category[], subcategoryId: string) {
  for (const category of categories) {
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    if (subcategory) {
      return { category, subcategory };
    }
  }
  return undefined;
}
