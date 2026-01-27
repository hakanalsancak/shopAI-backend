// ===========================================
// Mock Product Data
// Used for testing without Amazon API
// ===========================================

import { Product } from '../types';

// ===========================================
// Generate realistic mock products
// ===========================================

interface MockProductTemplate {
  keywords: string[];
  products: Partial<Product>[];
}

const mockTemplates: MockProductTemplate[] = [
  // SMARTPHONES
  {
    keywords: ['phone', 'smartphone', 'iphone', 'samsung', 'android', 'mobile'],
    products: [
      {
        asin: 'MOCK001',
        title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
        price: 1199.00,
        originalPrice: 1199.00,
        rating: 4.8,
        reviewCount: 12453,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'A17 Pro chip with 6-core GPU',
          '48MP main camera with advanced computational photography',
          'Action button for quick access',
          'Titanium design, lighter than ever',
          'All-day battery life',
        ],
      },
      {
        asin: 'MOCK002',
        title: 'Samsung Galaxy S24 Ultra 256GB - Titanium Black',
        price: 1149.00,
        originalPrice: 1299.00,
        rating: 4.7,
        reviewCount: 8921,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Galaxy AI built-in for instant translations',
          '200MP adaptive camera with AI zoom',
          'S Pen included with AI-powered features',
          'Snapdragon 8 Gen 3 processor',
          '5000mAh battery with fast charging',
        ],
      },
      {
        asin: 'MOCK003',
        title: 'Google Pixel 8 Pro 128GB - Obsidian',
        price: 899.00,
        originalPrice: 999.00,
        rating: 4.6,
        reviewCount: 5632,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Google Tensor G3 chip with AI capabilities',
          'Best-in-class camera with Magic Eraser',
          '7 years of OS and security updates',
          'Pro-level photo and video features',
          'Super smooth 120Hz display',
        ],
      },
      {
        asin: 'MOCK004',
        title: 'OnePlus 12 5G 256GB - Silky Black',
        price: 749.00,
        originalPrice: 849.00,
        rating: 4.5,
        reviewCount: 3421,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Snapdragon 8 Gen 3 flagship performance',
          'Hasselblad camera system',
          '100W SUPERVOOC fast charging',
          '2K 120Hz ProXDR display',
          '5400mAh battery',
        ],
      },
      {
        asin: 'MOCK005',
        title: 'Xiaomi 14 Ultra 512GB - Black',
        price: 1299.00,
        originalPrice: 1299.00,
        rating: 4.4,
        reviewCount: 1823,
        isPrime: false,
        availability: 'In Stock',
        features: [
          'Leica Summilux lens system',
          '1-inch main camera sensor',
          'Snapdragon 8 Gen 3 processor',
          '90W wired + 80W wireless charging',
          'Professional photography features',
        ],
      },
    ],
  },

  // LAPTOPS
  {
    keywords: ['laptop', 'macbook', 'notebook', 'computer', 'dell', 'hp', 'lenovo'],
    products: [
      {
        asin: 'MOCK010',
        title: 'Apple MacBook Pro 14" M3 Pro - Space Black 512GB',
        price: 1899.00,
        originalPrice: 1999.00,
        rating: 4.9,
        reviewCount: 7823,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'M3 Pro chip with 11-core CPU, 14-core GPU',
          '18GB unified memory',
          '17-hour battery life',
          'Liquid Retina XDR display',
          'MagSafe charging, HDMI, SD card slot',
        ],
      },
      {
        asin: 'MOCK011',
        title: 'Dell XPS 15 - 15.6" OLED, Intel Core i7, 16GB RAM, 512GB SSD',
        price: 1499.00,
        originalPrice: 1699.00,
        rating: 4.6,
        reviewCount: 4521,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Intel Core i7-13700H processor',
          '3.5K OLED InfinityEdge display',
          'NVIDIA GeForce RTX 4050 graphics',
          'CNC machined aluminum construction',
          'Windows 11 Pro',
        ],
      },
      {
        asin: 'MOCK012',
        title: 'Lenovo ThinkPad X1 Carbon Gen 11 - 14" 2.8K OLED',
        price: 1699.00,
        originalPrice: 1899.00,
        rating: 4.7,
        reviewCount: 3214,
        isPrime: true,
        availability: 'In Stock',
        features: [
          '13th Gen Intel Core i7 processor',
          '2.8K OLED display with HDR',
          'Military-grade durability',
          '15+ hour battery life',
          'Legendary ThinkPad keyboard',
        ],
      },
      {
        asin: 'MOCK013',
        title: 'ASUS ROG Zephyrus G14 - Gaming Laptop, RTX 4070, Ryzen 9',
        price: 1599.00,
        originalPrice: 1799.00,
        rating: 4.5,
        reviewCount: 2891,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'AMD Ryzen 9 7940HS processor',
          'NVIDIA GeForce RTX 4070 8GB',
          '14" QHD+ 165Hz display',
          'AniMe Matrix LED display lid',
          '76Wh battery with fast charging',
        ],
      },
      {
        asin: 'MOCK014',
        title: 'HP Spectre x360 16" 2-in-1 - OLED Touch, Intel Core i7',
        price: 1449.00,
        originalPrice: 1599.00,
        rating: 4.4,
        reviewCount: 1923,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Intel Core i7-1355U processor',
          '16" 3K OLED touchscreen',
          '360° convertible design',
          'Included HP stylus pen',
          'Bang & Olufsen quad speakers',
        ],
      },
    ],
  },

  // HEADPHONES
  {
    keywords: ['headphone', 'earbuds', 'airpods', 'wireless', 'noise cancelling', 'audio'],
    products: [
      {
        asin: 'MOCK020',
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
        price: 299.00,
        originalPrice: 379.00,
        rating: 4.7,
        reviewCount: 15632,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Industry-leading noise cancellation',
          '30-hour battery life',
          'Crystal clear hands-free calling',
          'Multi-device connection',
          'Foldable design with carry case',
        ],
      },
      {
        asin: 'MOCK021',
        title: 'Apple AirPods Pro (2nd Gen) with MagSafe Case',
        price: 229.00,
        originalPrice: 249.00,
        rating: 4.8,
        reviewCount: 23451,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Active Noise Cancellation',
          'Adaptive Transparency mode',
          'Personalized Spatial Audio',
          '6 hours listening, 30 with case',
          'Touch control for volume',
        ],
      },
      {
        asin: 'MOCK022',
        title: 'Bose QuietComfort Ultra Headphones - Black',
        price: 349.00,
        originalPrice: 429.00,
        rating: 4.6,
        reviewCount: 8921,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'World-class noise cancellation',
          'Immersive spatial audio',
          'Up to 24 hours battery',
          'CustomTune sound calibration',
          'Plush protein leather cushions',
        ],
      },
      {
        asin: 'MOCK023',
        title: 'Samsung Galaxy Buds2 Pro - Graphite',
        price: 159.00,
        originalPrice: 219.00,
        rating: 4.4,
        reviewCount: 6723,
        isPrime: true,
        availability: 'In Stock',
        features: [
          '24-bit Hi-Fi sound quality',
          'Intelligent ANC',
          '360 Audio with head tracking',
          '5 hours + 18 hours with case',
          'IPX7 water resistance',
        ],
      },
      {
        asin: 'MOCK024',
        title: 'Sennheiser Momentum 4 Wireless - Black',
        price: 279.00,
        originalPrice: 349.00,
        rating: 4.5,
        reviewCount: 4532,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Audiophile-grade sound quality',
          '60-hour battery life',
          'Adaptive noise cancellation',
          'Premium materials and design',
          'aptX Adaptive codec support',
        ],
      },
    ],
  },

  // VACUUM CLEANERS
  {
    keywords: ['vacuum', 'dyson', 'robot', 'cordless', 'cleaner', 'hoover'],
    products: [
      {
        asin: 'MOCK030',
        title: 'Dyson V15 Detect Absolute Cordless Vacuum',
        price: 599.00,
        originalPrice: 699.00,
        rating: 4.7,
        reviewCount: 9823,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Laser reveals invisible dust',
          'Piezo sensor counts particles',
          'Up to 60 minutes runtime',
          'Root Cyclone technology',
          'LCD screen shows real-time data',
        ],
      },
      {
        asin: 'MOCK031',
        title: 'iRobot Roomba j9+ Self-Emptying Robot Vacuum',
        price: 799.00,
        originalPrice: 999.00,
        rating: 4.5,
        reviewCount: 7621,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Self-emptying Clean Base',
          'PrecisionVision Navigation',
          'P.O.O.P. (Pet Owner Official Promise)',
          'Smart Mapping technology',
          'Works with Alexa and Google',
        ],
      },
      {
        asin: 'MOCK032',
        title: 'Shark IZ462H Anti Hair Wrap Cordless Vacuum',
        price: 349.00,
        originalPrice: 449.00,
        rating: 4.4,
        reviewCount: 5432,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Anti Hair Wrap technology',
          'Flexology bendable wand',
          'Up to 80 minutes runtime',
          'DuoClean PowerFins',
          'LED headlights',
        ],
      },
      {
        asin: 'MOCK033',
        title: 'Roborock S8 Pro Ultra Robot Vacuum & Mop',
        price: 1199.00,
        originalPrice: 1599.00,
        rating: 4.6,
        reviewCount: 3421,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Self-washing, self-emptying dock',
          '6000Pa suction power',
          'VibraRise 2.0 sonic mopping',
          'Reactive 3D obstacle avoidance',
          '3D structured light navigation',
        ],
      },
      {
        asin: 'MOCK034',
        title: 'Dyson Ball Animal 3 Upright Vacuum',
        price: 449.00,
        originalPrice: 549.00,
        rating: 4.3,
        reviewCount: 4123,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Designed for homes with pets',
          'Whole-machine HEPA filtration',
          'Ball technology for steering',
          'Self-adjusting cleaner head',
          '35ft reach with hose',
        ],
      },
    ],
  },

  // COFFEE MACHINES
  {
    keywords: ['coffee', 'espresso', 'machine', 'maker', 'nespresso', 'bean'],
    products: [
      {
        asin: 'MOCK040',
        title: 'De\'Longhi Magnifica Evo Bean-to-Cup Coffee Machine',
        price: 429.00,
        originalPrice: 549.00,
        rating: 4.5,
        reviewCount: 6723,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Built-in burr grinder',
          'LatteCrema automatic milk frother',
          '13 grind settings',
          'Touch panel controls',
          '1.8L water tank',
        ],
      },
      {
        asin: 'MOCK041',
        title: 'Nespresso Vertuo Next Coffee Machine by Magimix',
        price: 149.00,
        originalPrice: 199.00,
        rating: 4.4,
        reviewCount: 12453,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Centrifusion technology',
          '5 cup sizes from espresso to carafe',
          'One-touch brewing',
          'Automatic capsule recognition',
          'Made from 54% recycled plastic',
        ],
      },
      {
        asin: 'MOCK042',
        title: 'Sage Barista Express Impress Espresso Machine',
        price: 699.00,
        originalPrice: 799.00,
        rating: 4.7,
        reviewCount: 4521,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Assisted Tamping system',
          'Intelligent Dosing',
          'Precise espresso extraction',
          'Steam wand for micro-foam milk',
          'Integrated conical burr grinder',
        ],
      },
      {
        asin: 'MOCK043',
        title: 'Moccamaster KBGV Select Coffee Brewer',
        price: 279.00,
        originalPrice: 319.00,
        rating: 4.6,
        reviewCount: 3214,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'SCA Golden Cup certified',
          'Copper boiling element',
          'Brews in 4-6 minutes',
          'Handmade in the Netherlands',
          '5-year warranty',
        ],
      },
      {
        asin: 'MOCK044',
        title: 'Philips 3200 Series LatteGo Fully Automatic',
        price: 549.00,
        originalPrice: 649.00,
        rating: 4.3,
        reviewCount: 5632,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Easy-clean LatteGo system',
          '5 coffee varieties at one touch',
          'My Coffee Choice intensity settings',
          'AquaClean filter',
          'Ceramic grinders',
        ],
      },
    ],
  },

  // SMARTWATCHES
  {
    keywords: ['smartwatch', 'watch', 'fitness', 'tracker', 'apple watch', 'garmin'],
    products: [
      {
        asin: 'MOCK050',
        title: 'Apple Watch Series 9 GPS 45mm - Midnight Aluminium',
        price: 429.00,
        originalPrice: 449.00,
        rating: 4.8,
        reviewCount: 18723,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'S9 SiP with 4-core Neural Engine',
          'Double tap gesture control',
          'Always-On Retina display',
          'Blood oxygen & ECG apps',
          'Carbon neutral with Sport Loop',
        ],
      },
      {
        asin: 'MOCK051',
        title: 'Samsung Galaxy Watch6 Classic 47mm - Silver',
        price: 369.00,
        originalPrice: 429.00,
        rating: 4.5,
        reviewCount: 7821,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Rotating bezel control',
          'Advanced sleep coaching',
          'BioActive Sensor for health',
          'Wear OS with Google apps',
          'Sapphire crystal display',
        ],
      },
      {
        asin: 'MOCK052',
        title: 'Garmin Fenix 7X Solar Multisport GPS Watch',
        price: 699.00,
        originalPrice: 849.00,
        rating: 4.7,
        reviewCount: 5432,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Solar charging lens',
          'Up to 37 days battery',
          'Multi-band GPS',
          'Topo maps with ski resort maps',
          'Advanced training metrics',
        ],
      },
      {
        asin: 'MOCK053',
        title: 'Fitbit Sense 2 Advanced Health Smartwatch - Graphite',
        price: 219.00,
        originalPrice: 299.00,
        rating: 4.3,
        reviewCount: 8921,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Stress management with cEDA sensor',
          'Heart rate & oxygen tracking',
          'Sleep stages analysis',
          '6+ day battery life',
          'Google Assistant & Alexa built-in',
        ],
      },
      {
        asin: 'MOCK054',
        title: 'Amazfit GTR 4 Smart Watch - Superspeed Black',
        price: 169.00,
        originalPrice: 199.00,
        rating: 4.4,
        reviewCount: 4523,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Dual-band GPS & 6 satellite systems',
          '150+ sports modes',
          '14-day battery life',
          'Alexa built-in',
          'AMOLED display',
        ],
      },
    ],
  },

  // AIR FRYERS
  {
    keywords: ['air fryer', 'airfryer', 'ninja', 'philips', 'fryer'],
    products: [
      {
        asin: 'MOCK060',
        title: 'Ninja Foodi MAX Dual Zone Air Fryer AF400UK - 9.5L',
        price: 219.00,
        originalPrice: 269.00,
        rating: 4.7,
        reviewCount: 23451,
        isPrime: true,
        availability: 'In Stock',
        features: [
          '2 independent cooking zones',
          '9.5L total capacity',
          '6 cooking functions',
          'Sync & Match technology',
          'Dishwasher-safe parts',
        ],
      },
      {
        asin: 'MOCK061',
        title: 'Philips Airfryer XXL Connected HD9867/91',
        price: 299.00,
        originalPrice: 349.00,
        rating: 4.5,
        reviewCount: 8732,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Fat Removal technology',
          'WiFi connected with app',
          '1.4kg capacity',
          'Rapid Air technology',
          'NutriU app with recipes',
        ],
      },
      {
        asin: 'MOCK062',
        title: 'Cosori Pro LE 4.7L Air Fryer',
        price: 89.00,
        originalPrice: 109.00,
        rating: 4.6,
        reviewCount: 15632,
        isPrime: true,
        availability: 'In Stock',
        features: [
          '9 one-touch cooking functions',
          'Shake reminder function',
          'Non-stick basket',
          'Compact design',
          '100 recipes included',
        ],
      },
      {
        asin: 'MOCK063',
        title: 'Ninja Foodi FlexDrawer 10.4L Air Fryer AF500UK',
        price: 269.00,
        originalPrice: 329.00,
        rating: 4.6,
        reviewCount: 6721,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Mega Zone or 2 independent zones',
          '10.4L total capacity',
          '7 cooking functions',
          'Fits whole chicken or 2 pizzas',
          'Max Crisp technology',
        ],
      },
      {
        asin: 'MOCK064',
        title: 'Tower T17088 Vortx Vizion 7L Air Fryer',
        price: 79.00,
        originalPrice: 99.00,
        rating: 4.3,
        reviewCount: 9823,
        isPrime: true,
        availability: 'In Stock',
        features: [
          'Digital touch panel',
          '7L capacity',
          'See-through cooking window',
          '60-minute timer',
          '1800W power',
        ],
      },
    ],
  },
];

// Default fallback products
const defaultProducts: Product[] = [
  {
    asin: 'DEFAULT001',
    title: 'Premium Quality Product - Top Rated Choice',
    price: 149.99,
    currency: 'GBP',
    originalPrice: 199.99,
    imageUrl: 'https://via.placeholder.com/500x500?text=Product+1',
    rating: 4.5,
    reviewCount: 2341,
    amazonUrl: 'https://www.amazon.co.uk/dp/DEFAULT001',
    isPrime: true,
    availability: 'In Stock',
    features: ['High quality materials', 'Best seller', 'Free returns'],
  },
  {
    asin: 'DEFAULT002',
    title: 'Best Value Option - Great Performance',
    price: 89.99,
    currency: 'GBP',
    originalPrice: 129.99,
    imageUrl: 'https://via.placeholder.com/500x500?text=Product+2',
    rating: 4.3,
    reviewCount: 1892,
    amazonUrl: 'https://www.amazon.co.uk/dp/DEFAULT002',
    isPrime: true,
    availability: 'In Stock',
    features: ['Excellent value', 'Reliable quality', 'Fast delivery'],
  },
  {
    asin: 'DEFAULT003',
    title: 'Budget-Friendly Choice - Solid Performance',
    price: 59.99,
    currency: 'GBP',
    originalPrice: 79.99,
    imageUrl: 'https://via.placeholder.com/500x500?text=Product+3',
    rating: 4.1,
    reviewCount: 3421,
    amazonUrl: 'https://www.amazon.co.uk/dp/DEFAULT003',
    isPrime: false,
    availability: 'In Stock',
    features: ['Affordable price', 'Good quality', 'Popular choice'],
  },
  {
    asin: 'DEFAULT004',
    title: 'Professional Grade - Premium Features',
    price: 299.99,
    currency: 'GBP',
    originalPrice: 349.99,
    imageUrl: 'https://via.placeholder.com/500x500?text=Product+4',
    rating: 4.7,
    reviewCount: 1234,
    amazonUrl: 'https://www.amazon.co.uk/dp/DEFAULT004',
    isPrime: true,
    availability: 'In Stock',
    features: ['Professional quality', 'Advanced features', 'Durable'],
  },
  {
    asin: 'DEFAULT005',
    title: 'Compact & Portable - Easy to Use',
    price: 39.99,
    currency: 'GBP',
    originalPrice: 49.99,
    imageUrl: 'https://via.placeholder.com/500x500?text=Product+5',
    rating: 4.2,
    reviewCount: 5621,
    amazonUrl: 'https://www.amazon.co.uk/dp/DEFAULT005',
    isPrime: true,
    availability: 'In Stock',
    features: ['Compact design', 'Easy setup', 'Portable'],
  },
];

// ===========================================
// Mock Data Functions
// ===========================================

export function getMockProducts(
  keywords: string[],
  region: string = 'UK',
  priceMin?: number,
  priceMax?: number
): Product[] {
  const currency = region === 'US' ? 'USD' : 'GBP';
  const baseUrl = region === 'US' ? 'https://www.amazon.com' : 'https://www.amazon.co.uk';
  
  // Find matching template
  const searchTerms = keywords.map(k => k.toLowerCase());
  let matchedProducts: Partial<Product>[] = [];
  
  for (const template of mockTemplates) {
    const hasMatch = template.keywords.some(kw => 
      searchTerms.some(st => st.includes(kw) || kw.includes(st))
    );
    if (hasMatch) {
      matchedProducts = template.products;
      break;
    }
  }
  
  // Use default products if no match
  if (matchedProducts.length === 0) {
    matchedProducts = defaultProducts;
  }
  
  // Convert to full products with region-specific data
  let products: Product[] = matchedProducts.map((p, index) => ({
    asin: p.asin || `MOCK${Date.now()}${index}`,
    title: p.title || 'Mock Product',
    price: p.price || 99.99,
    currency: currency,
    originalPrice: p.originalPrice,
    imageUrl: `https://picsum.photos/seed/${p.asin || index}/500/500`,
    rating: p.rating || 4.0,
    reviewCount: p.reviewCount || 100,
    amazonUrl: `${baseUrl}/dp/${p.asin || `MOCK${index}`}?tag=${region === 'US' ? 'shopai-us-20' : 'shopai-uk-20'}`,
    isPrime: p.isPrime ?? true,
    availability: p.availability || 'In Stock',
    features: p.features || ['Quality product', 'Good value'],
  }));
  
  // Apply price filter
  if (priceMin !== undefined || priceMax !== undefined) {
    products = products.filter(p => {
      if (priceMin !== undefined && p.price < priceMin) return false;
      if (priceMax !== undefined && p.price > priceMax) return false;
      return true;
    });
  }
  
  // Ensure we always return at least 3 products
  if (products.length < 3) {
    products = defaultProducts.map((p, index) => ({
      ...p,
      currency,
      amazonUrl: `${baseUrl}/dp/${p.asin}?tag=${region === 'US' ? 'shopai-us-20' : 'shopai-uk-20'}`,
      imageUrl: `https://picsum.photos/seed/${p.asin}/500/500`,
    }));
  }
  
  return products.slice(0, 10); // Return max 10 products
}
