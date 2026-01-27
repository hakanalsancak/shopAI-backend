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

const defaultPriorities = [
  { id: 'quality', label: 'Quality' },
  { id: 'value', label: 'Value for money' },
  { id: 'brand', label: 'Brand reputation' },
  { id: 'features', label: 'Features' },
  { id: 'durability', label: 'Durability' },
];

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
        id: 'camera-photo',
        name: 'Camera & Photo',
        icon: 'camera.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of camera are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'dslr', label: 'DSLR', value: 'DSLR camera' },
                { id: 'mirrorless', label: 'Mirrorless', value: 'mirrorless camera' },
                { id: 'compact', label: 'Compact / Point & Shoot', value: 'compact camera' },
                { id: 'action', label: 'Action Camera', value: 'action camera GoPro' },
                { id: 'instant', label: 'Instant Camera', value: 'instant camera Polaroid' },
              ],
            },
            budgetQuestion(currency, 3000),
            prioritiesQuestion([
              { id: 'image', label: 'Image quality' },
              { id: 'video', label: 'Video capability' },
              { id: 'portability', label: 'Portability' },
              { id: 'ease', label: 'Ease of use' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'tv-home-cinema',
        name: 'TV & Home Cinema',
        icon: 'tv.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'tv', label: 'Television', value: 'smart TV' },
                { id: 'projector', label: 'Projector', value: 'home projector' },
                { id: 'soundbar', label: 'Soundbar', value: 'soundbar' },
                { id: 'hometheater', label: 'Home Theater System', value: 'home theater system' },
              ],
            },
            budgetQuestion(currency, 3000),
            prioritiesQuestion([
              { id: 'picture', label: 'Picture quality' },
              { id: 'sound', label: 'Sound quality' },
              { id: 'smart', label: 'Smart features' },
              { id: 'size', label: 'Screen size' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'audio-hifi',
        name: 'Audio & HiFi',
        icon: 'hifispeaker.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of audio equipment?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'speakers', label: 'Speakers', value: 'speakers hifi' },
                { id: 'amplifier', label: 'Amplifier', value: 'amplifier hifi' },
                { id: 'turntable', label: 'Turntable', value: 'turntable vinyl' },
                { id: 'receiver', label: 'AV Receiver', value: 'AV receiver' },
                { id: 'smartspeaker', label: 'Smart Speaker', value: 'smart speaker' },
              ],
            },
            budgetQuestion(currency, 2000),
            prioritiesQuestion([
              { id: 'sound', label: 'Sound quality' },
              { id: 'power', label: 'Power output' },
              { id: 'connectivity', label: 'Connectivity' },
              { id: 'design', label: 'Design' },
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
                { id: 'overear', label: 'Over-ear', value: 'over-ear headphones' },
                { id: 'onear', label: 'On-ear', value: 'on-ear headphones' },
                { id: 'inear', label: 'In-ear / Earbuds', value: 'earbuds' },
                { id: 'tws', label: 'True Wireless', value: 'true wireless earbuds' },
              ],
            },
            {
              id: 'wireless',
              text: 'Wireless preference?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'wireless', label: 'Wireless (Bluetooth)', value: 'wireless bluetooth' },
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
        id: 'sat-nav-car',
        name: 'Sat Nav & Car Electronics',
        icon: 'car.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'satnav', label: 'Sat Nav / GPS', value: 'sat nav GPS' },
                { id: 'dashcam', label: 'Dash Cam', value: 'dash cam' },
                { id: 'carstereo', label: 'Car Stereo', value: 'car stereo' },
                { id: 'carcharger', label: 'Car Charger', value: 'car charger' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'phones-accessories',
        name: 'Phones & Accessories',
        icon: 'iphone',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'smartphone', label: 'Smartphone', value: 'smartphone' },
                { id: 'case', label: 'Phone Case', value: 'phone case' },
                { id: 'charger', label: 'Charger', value: 'phone charger' },
                { id: 'screenprotector', label: 'Screen Protector', value: 'screen protector' },
                { id: 'powerbank', label: 'Power Bank', value: 'power bank' },
              ],
            },
            budgetQuestion(currency, 2000),
            prioritiesQuestion([
              { id: 'performance', label: 'Performance' },
              { id: 'camera', label: 'Camera quality' },
              { id: 'battery', label: 'Battery life' },
              { id: 'display', label: 'Display' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'pc-video-games',
        name: 'PC & Video Games',
        icon: 'gamecontroller.fill',
        categoryId: 'electronics',
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
      {
        id: 'laptops',
        name: 'Laptops',
        icon: 'laptopcomputer',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'usage',
              text: 'What will you mainly use it for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'general', label: 'General use & browsing', value: 'laptop general use' },
                { id: 'work', label: 'Work & productivity', value: 'laptop business' },
                { id: 'creative', label: 'Creative work (video, design)', value: 'laptop creative' },
                { id: 'gaming', label: 'Gaming', value: 'gaming laptop' },
                { id: 'coding', label: 'Programming', value: 'laptop programming' },
              ],
            },
            budgetQuestion(currency, 3000),
            prioritiesQuestion([
              { id: 'performance', label: 'Performance' },
              { id: 'portability', label: 'Portability' },
              { id: 'battery', label: 'Battery life' },
              { id: 'display', label: 'Display quality' },
              { id: 'value', label: 'Value for money' },
            ]),
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
        id: 'desktops',
        name: 'Desktops',
        icon: 'desktopcomputer',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'usage',
              text: 'What will you mainly use it for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'general', label: 'General use', value: 'desktop computer' },
                { id: 'gaming', label: 'Gaming', value: 'gaming PC desktop' },
                { id: 'work', label: 'Work & productivity', value: 'business desktop' },
                { id: 'creative', label: 'Creative work', value: 'workstation desktop' },
              ],
            },
            budgetQuestion(currency, 3000),
            prioritiesQuestion([
              { id: 'performance', label: 'Performance' },
              { id: 'storage', label: 'Storage' },
              { id: 'graphics', label: 'Graphics' },
              { id: 'upgradeability', label: 'Upgradeability' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'monitors',
        name: 'Monitors',
        icon: 'display',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'usage',
              text: 'Primary use?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'general', label: 'General use', value: 'computer monitor' },
                { id: 'gaming', label: 'Gaming', value: 'gaming monitor' },
                { id: 'creative', label: 'Creative work', value: 'professional monitor' },
                { id: 'office', label: 'Office work', value: 'office monitor' },
              ],
            },
            budgetQuestion(currency, 1500),
            prioritiesQuestion([
              { id: 'resolution', label: 'Resolution' },
              { id: 'refresh', label: 'Refresh rate' },
              { id: 'color', label: 'Color accuracy' },
              { id: 'size', label: 'Screen size' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'memory-storage',
        name: 'Memory & Storage',
        icon: 'externaldrive.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of storage?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'ssd', label: 'SSD', value: 'SSD solid state drive' },
                { id: 'hdd', label: 'Hard Drive', value: 'hard drive HDD' },
                { id: 'external', label: 'External Drive', value: 'external hard drive' },
                { id: 'usb', label: 'USB Flash Drive', value: 'USB flash drive' },
                { id: 'sdcard', label: 'SD Card', value: 'SD card memory' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'networking',
        name: 'Networking Devices',
        icon: 'wifi',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What do you need?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'router', label: 'WiFi Router', value: 'wifi router' },
                { id: 'mesh', label: 'Mesh WiFi System', value: 'mesh wifi system' },
                { id: 'extender', label: 'WiFi Extender', value: 'wifi extender' },
                { id: 'switch', label: 'Network Switch', value: 'network switch' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'computer-accessories',
        name: 'Computer Accessories',
        icon: 'keyboard.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What accessory are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'keyboard', label: 'Keyboard', value: 'keyboard' },
                { id: 'mouse', label: 'Mouse', value: 'mouse' },
                { id: 'webcam', label: 'Webcam', value: 'webcam' },
                { id: 'hub', label: 'USB Hub / Dock', value: 'USB hub dock' },
                { id: 'stand', label: 'Laptop Stand', value: 'laptop stand' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'computer-components',
        name: 'Computer Components',
        icon: 'cpu.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What component?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'gpu', label: 'Graphics Card', value: 'graphics card GPU' },
                { id: 'cpu', label: 'Processor / CPU', value: 'processor CPU' },
                { id: 'ram', label: 'RAM Memory', value: 'RAM memory' },
                { id: 'motherboard', label: 'Motherboard', value: 'motherboard' },
                { id: 'psu', label: 'Power Supply', value: 'power supply PSU' },
                { id: 'case', label: 'PC Case', value: 'PC case' },
              ],
            },
            budgetQuestion(currency, 1500),
            prioritiesQuestion([
              { id: 'performance', label: 'Performance' },
              { id: 'compatibility', label: 'Compatibility' },
              { id: 'cooling', label: 'Cooling' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'software',
        name: 'Software',
        icon: 'app.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of software?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'office', label: 'Office & Productivity', value: 'office software' },
                { id: 'security', label: 'Security & Antivirus', value: 'antivirus security software' },
                { id: 'creative', label: 'Creative & Design', value: 'creative design software' },
                { id: 'os', label: 'Operating System', value: 'operating system' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'printers-ink',
        name: 'Printers & Ink',
        icon: 'printer.fill',
        categoryId: 'electronics',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of printer?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'inkjet', label: 'Inkjet Printer', value: 'inkjet printer' },
                { id: 'laser', label: 'Laser Printer', value: 'laser printer' },
                { id: 'photo', label: 'Photo Printer', value: 'photo printer' },
                { id: 'allinone', label: 'All-in-One', value: 'all in one printer' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion([
              { id: 'quality', label: 'Print quality' },
              { id: 'speed', label: 'Print speed' },
              { id: 'cost', label: 'Running costs' },
              { id: 'wireless', label: 'Wireless printing' },
              { id: 'value', label: 'Value for money' },
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
        id: 'kitchen-appliances',
        name: 'Kitchen & Home Appliances',
        icon: 'refrigerator.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What appliance are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'kettle', label: 'Kettle', value: 'kettle' },
                { id: 'toaster', label: 'Toaster', value: 'toaster' },
                { id: 'blender', label: 'Blender', value: 'blender' },
                { id: 'coffee', label: 'Coffee Machine', value: 'coffee machine' },
                { id: 'airfryer', label: 'Air Fryer', value: 'air fryer' },
                { id: 'microwave', label: 'Microwave', value: 'microwave' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'large-appliances',
        name: 'Large Appliances',
        icon: 'washer.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What appliance?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'fridge', label: 'Fridge / Freezer', value: 'fridge freezer' },
                { id: 'washing', label: 'Washing Machine', value: 'washing machine' },
                { id: 'dryer', label: 'Tumble Dryer', value: 'tumble dryer' },
                { id: 'dishwasher', label: 'Dishwasher', value: 'dishwasher' },
                { id: 'oven', label: 'Oven / Cooker', value: 'oven cooker' },
              ],
            },
            budgetQuestion(currency, 2000),
            prioritiesQuestion([
              { id: 'efficiency', label: 'Energy efficiency' },
              { id: 'capacity', label: 'Capacity' },
              { id: 'quiet', label: 'Quiet operation' },
              { id: 'features', label: 'Features' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'cooking-dining',
        name: 'Cooking & Dining',
        icon: 'fork.knife',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'cookware', label: 'Pots & Pans', value: 'cookware pots pans' },
                { id: 'cutlery', label: 'Cutlery', value: 'cutlery set' },
                { id: 'dinnerware', label: 'Dinnerware', value: 'dinnerware plates' },
                { id: 'glassware', label: 'Glassware', value: 'glassware' },
                { id: 'utensils', label: 'Kitchen Utensils', value: 'kitchen utensils' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'furniture',
        name: 'Furniture',
        icon: 'sofa.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What furniture?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'sofa', label: 'Sofa', value: 'sofa' },
                { id: 'bed', label: 'Bed', value: 'bed frame' },
                { id: 'table', label: 'Table', value: 'table' },
                { id: 'chair', label: 'Chair', value: 'chair' },
                { id: 'storage', label: 'Storage', value: 'storage furniture' },
                { id: 'desk', label: 'Desk', value: 'desk' },
              ],
            },
            budgetQuestion(currency, 2000),
            prioritiesQuestion([
              { id: 'comfort', label: 'Comfort' },
              { id: 'style', label: 'Style' },
              { id: 'durability', label: 'Durability' },
              { id: 'size', label: 'Size' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'bedding-linens',
        name: 'Bedding & Linens',
        icon: 'bed.double.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'duvet', label: 'Duvet / Comforter', value: 'duvet comforter' },
                { id: 'sheets', label: 'Bed Sheets', value: 'bed sheets' },
                { id: 'pillows', label: 'Pillows', value: 'pillows' },
                { id: 'mattress', label: 'Mattress', value: 'mattress' },
                { id: 'towels', label: 'Towels', value: 'towels' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'home-accessories',
        name: 'Home Accessories',
        icon: 'lamp.table.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of accessory?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'decor', label: 'Decorative Items', value: 'home decor' },
                { id: 'mirrors', label: 'Mirrors', value: 'mirror' },
                { id: 'rugs', label: 'Rugs', value: 'rug' },
                { id: 'curtains', label: 'Curtains', value: 'curtains' },
                { id: 'frames', label: 'Picture Frames', value: 'picture frames' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'arts-crafts',
        name: 'Arts, Crafts & Sewing',
        icon: 'paintpalette.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you interested in?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'art', label: 'Art Supplies', value: 'art supplies' },
                { id: 'craft', label: 'Craft Supplies', value: 'craft supplies' },
                { id: 'sewing', label: 'Sewing', value: 'sewing supplies machine' },
                { id: 'knitting', label: 'Knitting & Crochet', value: 'knitting crochet' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'garden-outdoors',
        name: 'Garden & Outdoors',
        icon: 'leaf.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'furniture', label: 'Garden Furniture', value: 'garden furniture' },
                { id: 'plants', label: 'Plants & Seeds', value: 'plants seeds' },
                { id: 'mower', label: 'Lawn Mower', value: 'lawn mower' },
                { id: 'bbq', label: 'BBQ & Grill', value: 'BBQ grill' },
                { id: 'decor', label: 'Garden Decor', value: 'garden decor' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'power-tools',
        name: 'Power, Garden & Hand Tools',
        icon: 'hammer.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of tool?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'drill', label: 'Drill', value: 'drill' },
                { id: 'saw', label: 'Saw', value: 'saw' },
                { id: 'sander', label: 'Sander', value: 'sander' },
                { id: 'hand', label: 'Hand Tools', value: 'hand tools' },
                { id: 'toolkit', label: 'Tool Kit', value: 'tool kit' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion([
              { id: 'power', label: 'Power' },
              { id: 'cordless', label: 'Cordless' },
              { id: 'durability', label: 'Durability' },
              { id: 'brand', label: 'Brand' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'kitchen-bathroom-fixtures',
        name: 'Kitchen & Bathroom Fixtures',
        icon: 'shower.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What fixture?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'taps', label: 'Taps / Faucets', value: 'taps faucets' },
                { id: 'shower', label: 'Shower', value: 'shower' },
                { id: 'toilet', label: 'Toilet', value: 'toilet' },
                { id: 'sink', label: 'Sink', value: 'sink' },
                { id: 'bath', label: 'Bathtub', value: 'bathtub' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'professional-tools',
        name: 'Trade & Professional Tools',
        icon: 'wrench.and.screwdriver.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'trade',
              text: 'What trade?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'electrical', label: 'Electrical', value: 'electrical tools' },
                { id: 'plumbing', label: 'Plumbing', value: 'plumbing tools' },
                { id: 'carpentry', label: 'Carpentry', value: 'carpentry tools' },
                { id: 'general', label: 'General Trade', value: 'professional tools' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'smart-home',
        name: 'Smart Home',
        icon: 'homekit',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What smart device?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'speaker', label: 'Smart Speaker', value: 'smart speaker Alexa' },
                { id: 'thermostat', label: 'Smart Thermostat', value: 'smart thermostat' },
                { id: 'lights', label: 'Smart Lights', value: 'smart lights bulbs' },
                { id: 'camera', label: 'Smart Camera', value: 'smart security camera' },
                { id: 'doorbell', label: 'Smart Doorbell', value: 'smart doorbell' },
                { id: 'lock', label: 'Smart Lock', value: 'smart lock' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'lighting',
        name: 'Lighting',
        icon: 'lightbulb.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of lighting?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'ceiling', label: 'Ceiling Lights', value: 'ceiling light' },
                { id: 'lamp', label: 'Table / Floor Lamp', value: 'lamp' },
                { id: 'outdoor', label: 'Outdoor Lighting', value: 'outdoor lighting' },
                { id: 'led', label: 'LED Strip Lights', value: 'LED strip lights' },
                { id: 'bulbs', label: 'Light Bulbs', value: 'light bulbs' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'pet-supplies',
        name: 'Pet Supplies',
        icon: 'pawprint.fill',
        categoryId: 'home',
        questionFlow: {
          questions: [
            {
              id: 'pet',
              text: 'What pet?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'dog', label: 'Dog', value: 'dog' },
                { id: 'cat', label: 'Cat', value: 'cat' },
                { id: 'bird', label: 'Bird', value: 'bird' },
                { id: 'fish', label: 'Fish', value: 'fish aquarium' },
                { id: 'small', label: 'Small Animal', value: 'small pet' },
              ],
            },
            {
              id: 'type',
              text: 'What do you need?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'food', label: 'Food', value: 'pet food' },
                { id: 'bed', label: 'Bed', value: 'pet bed' },
                { id: 'toys', label: 'Toys', value: 'pet toys' },
                { id: 'grooming', label: 'Grooming', value: 'pet grooming' },
                { id: 'accessories', label: 'Accessories', value: 'pet accessories' },
              ],
            },
            budgetQuestion(currency, 200),
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
    description: 'For kids & babies',
    subcategories: [
      {
        id: 'toys-games',
        name: 'Toys & Games',
        icon: 'gamecontroller.fill',
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
                { id: 'teens', label: '12+ years', value: 'teen toys' },
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
                { id: 'dolls', label: 'Dolls & Action Figures', value: 'dolls action figures' },
                { id: 'boardgames', label: 'Board Games', value: 'board games' },
              ],
            },
            budgetQuestion(currency, 200),
          ],
        },
      },
      {
        id: 'baby',
        name: 'Baby',
        icon: 'figure.and.child.holdinghands',
        categoryId: 'toys',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'feeding', label: 'Feeding', value: 'baby feeding bottles' },
                { id: 'nappies', label: 'Nappies & Changing', value: 'nappies diapers' },
                { id: 'pushchair', label: 'Pushchair / Stroller', value: 'pushchair stroller' },
                { id: 'cot', label: 'Cot / Crib', value: 'baby cot crib' },
                { id: 'carseat', label: 'Car Seat', value: 'baby car seat' },
                { id: 'monitor', label: 'Baby Monitor', value: 'baby monitor' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion([
              { id: 'safety', label: 'Safety' },
              { id: 'quality', label: 'Quality' },
              { id: 'ease', label: 'Ease of use' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'kids-baby-fashion',
        name: "Kids' & Baby Fashion",
        icon: 'tshirt.fill',
        categoryId: 'toys',
        questionFlow: {
          questions: [
            {
              id: 'age',
              text: 'Age group?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'newborn', label: 'Newborn (0-3 months)', value: 'newborn clothes' },
                { id: 'baby', label: 'Baby (3-24 months)', value: 'baby clothes' },
                { id: 'toddler', label: 'Toddler (2-4 years)', value: 'toddler clothes' },
                { id: 'kids', label: 'Kids (4-12 years)', value: 'kids clothes' },
              ],
            },
            {
              id: 'type',
              text: 'What type of clothing?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'everyday', label: 'Everyday Wear', value: 'everyday clothes' },
                { id: 'sleepwear', label: 'Sleepwear', value: 'sleepwear pyjamas' },
                { id: 'outerwear', label: 'Outerwear', value: 'jacket coat' },
                { id: 'shoes', label: 'Shoes', value: 'shoes' },
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
        id: 'women',
        name: 'Women',
        icon: 'figure.stand.dress',
        categoryId: 'fashion',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'dresses', label: 'Dresses', value: 'women dresses' },
                { id: 'tops', label: 'Tops', value: 'women tops' },
                { id: 'jeans', label: 'Jeans & Trousers', value: 'women jeans trousers' },
                { id: 'shoes', label: 'Shoes', value: 'women shoes' },
                { id: 'bags', label: 'Bags', value: 'women bags handbags' },
                { id: 'watches', label: 'Watches', value: 'women watches' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion([
              { id: 'style', label: 'Style' },
              { id: 'comfort', label: 'Comfort' },
              { id: 'quality', label: 'Quality' },
              { id: 'brand', label: 'Brand' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'men',
        name: 'Men',
        icon: 'figure.stand',
        categoryId: 'fashion',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'shirts', label: 'Shirts', value: 'men shirts' },
                { id: 'tshirts', label: 'T-Shirts', value: 'men t-shirts' },
                { id: 'jeans', label: 'Jeans & Trousers', value: 'men jeans trousers' },
                { id: 'shoes', label: 'Shoes', value: 'men shoes' },
                { id: 'suits', label: 'Suits', value: 'men suits' },
                { id: 'watches', label: 'Watches', value: 'men watches' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion([
              { id: 'style', label: 'Style' },
              { id: 'comfort', label: 'Comfort' },
              { id: 'quality', label: 'Quality' },
              { id: 'brand', label: 'Brand' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'boys',
        name: 'Boys',
        icon: 'figure.child',
        categoryId: 'fashion',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'tops', label: 'Tops & T-Shirts', value: 'boys tops t-shirts' },
                { id: 'trousers', label: 'Trousers & Jeans', value: 'boys trousers jeans' },
                { id: 'shoes', label: 'Shoes', value: 'boys shoes' },
                { id: 'outerwear', label: 'Coats & Jackets', value: 'boys coats jackets' },
              ],
            },
            budgetQuestion(currency, 100),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'girls',
        name: 'Girls',
        icon: 'figure.child',
        categoryId: 'fashion',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'dresses', label: 'Dresses', value: 'girls dresses' },
                { id: 'tops', label: 'Tops', value: 'girls tops' },
                { id: 'trousers', label: 'Trousers & Leggings', value: 'girls trousers leggings' },
                { id: 'shoes', label: 'Shoes', value: 'girls shoes' },
                { id: 'outerwear', label: 'Coats & Jackets', value: 'girls coats jackets' },
              ],
            },
            budgetQuestion(currency, 100),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'fashion-baby',
        name: 'Baby',
        icon: 'figure.and.child.holdinghands',
        categoryId: 'fashion',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'bodysuits', label: 'Bodysuits', value: 'baby bodysuits' },
                { id: 'sleepsuits', label: 'Sleepsuits', value: 'baby sleepsuits' },
                { id: 'outfits', label: 'Outfits & Sets', value: 'baby outfits sets' },
                { id: 'shoes', label: 'Shoes', value: 'baby shoes' },
              ],
            },
            budgetQuestion(currency, 50),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'luggage',
        name: 'Luggage',
        icon: 'suitcase.fill',
        categoryId: 'fashion',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of luggage?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'suitcase', label: 'Suitcase', value: 'suitcase' },
                { id: 'carry-on', label: 'Carry-on / Cabin Bag', value: 'carry-on cabin bag' },
                { id: 'backpack', label: 'Travel Backpack', value: 'travel backpack' },
                { id: 'duffel', label: 'Duffel Bag', value: 'duffel bag' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion([
              { id: 'durability', label: 'Durability' },
              { id: 'weight', label: 'Lightweight' },
              { id: 'capacity', label: 'Capacity' },
              { id: 'wheels', label: 'Wheels/Manoeuvrability' },
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
    id: 'sports',
    name: 'Sports & Outdoors',
    icon: 'figure.run',
    description: 'Exercise & outdoor activities',
    subcategories: [
      {
        id: 'sports-clothing',
        name: 'Sports & Outdoor Clothing',
        icon: 'tshirt.fill',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of clothing?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'tops', label: 'Sports Tops', value: 'sports tops' },
                { id: 'bottoms', label: 'Sports Bottoms', value: 'sports shorts leggings' },
                { id: 'jackets', label: 'Sports Jackets', value: 'sports jackets' },
                { id: 'outdoor', label: 'Outdoor Wear', value: 'outdoor clothing hiking' },
              ],
            },
            budgetQuestion(currency, 200),
            prioritiesQuestion([
              { id: 'comfort', label: 'Comfort' },
              { id: 'breathability', label: 'Breathability' },
              { id: 'durability', label: 'Durability' },
              { id: 'style', label: 'Style' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'sports-shoes',
        name: 'Sports & Outdoor Shoes',
        icon: 'shoe.fill',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of shoes?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'running', label: 'Running Shoes', value: 'running shoes' },
                { id: 'training', label: 'Training Shoes', value: 'training shoes' },
                { id: 'hiking', label: 'Hiking Boots', value: 'hiking boots' },
                { id: 'football', label: 'Football Boots', value: 'football boots' },
              ],
            },
            budgetQuestion(currency, 200),
            prioritiesQuestion([
              { id: 'comfort', label: 'Comfort' },
              { id: 'support', label: 'Support' },
              { id: 'durability', label: 'Durability' },
              { id: 'grip', label: 'Grip' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'fitness',
        name: 'Fitness',
        icon: 'dumbbell.fill',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What fitness equipment?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'weights', label: 'Weights & Dumbbells', value: 'weights dumbbells' },
                { id: 'cardio', label: 'Cardio Equipment', value: 'treadmill exercise bike' },
                { id: 'yoga', label: 'Yoga & Pilates', value: 'yoga mat pilates' },
                { id: 'resistance', label: 'Resistance Bands', value: 'resistance bands' },
                { id: 'tracker', label: 'Fitness Tracker', value: 'fitness tracker smartwatch' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'camping-hiking',
        name: 'Camping & Hiking',
        icon: 'tent.fill',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What do you need?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'tent', label: 'Tent', value: 'tent camping' },
                { id: 'sleepingbag', label: 'Sleeping Bag', value: 'sleeping bag' },
                { id: 'backpack', label: 'Hiking Backpack', value: 'hiking backpack' },
                { id: 'cookware', label: 'Camping Cookware', value: 'camping cookware' },
                { id: 'lighting', label: 'Camping Lights', value: 'camping lantern torch' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'cycling',
        name: 'Cycling',
        icon: 'bicycle',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'bike', label: 'Bicycle', value: 'bicycle bike' },
                { id: 'helmet', label: 'Helmet', value: 'cycling helmet' },
                { id: 'clothing', label: 'Cycling Clothing', value: 'cycling clothing' },
                { id: 'accessories', label: 'Accessories', value: 'cycling accessories' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'sports-tech',
        name: 'Sports Technology',
        icon: 'applewatch',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What technology?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'watch', label: 'Sports Watch', value: 'sports watch GPS' },
                { id: 'tracker', label: 'Fitness Tracker', value: 'fitness tracker' },
                { id: 'hrm', label: 'Heart Rate Monitor', value: 'heart rate monitor' },
                { id: 'gps', label: 'GPS Device', value: 'GPS sports' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'water-sports',
        name: 'Water Sports',
        icon: 'figure.pool.swim',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What water sport?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'swimming', label: 'Swimming', value: 'swimming goggles swimwear' },
                { id: 'surfing', label: 'Surfing', value: 'surfboard surfing' },
                { id: 'kayak', label: 'Kayaking', value: 'kayak paddleboard' },
                { id: 'diving', label: 'Diving / Snorkelling', value: 'diving snorkelling' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'winter-sports',
        name: 'Winter Sports',
        icon: 'snowflake',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What winter sport?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'skiing', label: 'Skiing', value: 'ski skiing equipment' },
                { id: 'snowboarding', label: 'Snowboarding', value: 'snowboard snowboarding' },
                { id: 'clothing', label: 'Winter Sports Clothing', value: 'ski jacket trousers' },
                { id: 'accessories', label: 'Accessories', value: 'ski goggles gloves' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'golf',
        name: 'Golf',
        icon: 'figure.golf',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'clubs', label: 'Golf Clubs', value: 'golf clubs' },
                { id: 'balls', label: 'Golf Balls', value: 'golf balls' },
                { id: 'bag', label: 'Golf Bag', value: 'golf bag' },
                { id: 'clothing', label: 'Golf Clothing', value: 'golf clothing' },
                { id: 'gps', label: 'Golf GPS / Rangefinder', value: 'golf GPS rangefinder' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'running',
        name: 'Running',
        icon: 'figure.run',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What do you need?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'shoes', label: 'Running Shoes', value: 'running shoes' },
                { id: 'clothing', label: 'Running Clothing', value: 'running clothing' },
                { id: 'watch', label: 'Running Watch', value: 'running watch GPS' },
                { id: 'accessories', label: 'Running Accessories', value: 'running accessories belt armband' },
              ],
            },
            budgetQuestion(currency, 300),
            prioritiesQuestion([
              { id: 'comfort', label: 'Comfort' },
              { id: 'support', label: 'Support' },
              { id: 'lightweight', label: 'Lightweight' },
              { id: 'durability', label: 'Durability' },
              { id: 'value', label: 'Value for money' },
            ]),
          ],
        },
      },
      {
        id: 'sports-nutrition',
        name: 'Sports Nutrition',
        icon: 'leaf.fill',
        categoryId: 'sports',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of nutrition?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'protein', label: 'Protein Powder', value: 'protein powder' },
                { id: 'preworkout', label: 'Pre-Workout', value: 'pre-workout supplement' },
                { id: 'bars', label: 'Protein Bars', value: 'protein bars' },
                { id: 'vitamins', label: 'Vitamins & Supplements', value: 'vitamins supplements sports' },
              ],
            },
            budgetQuestion(currency, 100),
            prioritiesQuestion([
              { id: 'taste', label: 'Taste' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'effectiveness', label: 'Effectiveness' },
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
        id: 'premium-beauty',
        name: 'Premium Beauty',
        icon: 'sparkles',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What premium product?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'skincare', label: 'Premium Skincare', value: 'luxury premium skincare' },
                { id: 'makeup', label: 'Premium Makeup', value: 'luxury premium makeup' },
                { id: 'fragrance', label: 'Designer Fragrance', value: 'designer perfume fragrance' },
                { id: 'haircare', label: 'Premium Hair Care', value: 'luxury hair care' },
              ],
            },
            budgetQuestion(currency, 500),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'beauty-bundles',
        name: 'Beauty Bundles',
        icon: 'gift.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What type of bundle?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'skincare', label: 'Skincare Set', value: 'skincare gift set bundle' },
                { id: 'makeup', label: 'Makeup Set', value: 'makeup gift set bundle' },
                { id: 'fragrance', label: 'Fragrance Set', value: 'fragrance gift set' },
                { id: 'grooming', label: 'Grooming Set', value: 'grooming gift set' },
              ],
            },
            budgetQuestion(currency, 200),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'hair-care',
        name: 'Hair Care',
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
                { id: 'shampoo', label: 'Shampoo & Conditioner', value: 'shampoo conditioner' },
                { id: 'styling', label: 'Styling Products', value: 'hair styling products' },
                { id: 'treatment', label: 'Hair Treatment', value: 'hair treatment mask' },
                { id: 'tools', label: 'Hair Tools', value: 'hair dryer straightener' },
              ],
            },
            budgetQuestion(currency, 200),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'skin-care',
        name: 'Skin Care',
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
                { id: 'acne', label: 'Acne & Breakouts', value: 'acne treatment' },
                { id: 'aging', label: 'Anti-aging', value: 'anti-aging' },
                { id: 'hydration', label: 'Hydration', value: 'hydrating moisturizing' },
                { id: 'brightening', label: 'Brightening', value: 'brightening vitamin c' },
                { id: 'sensitivity', label: 'Sensitivity', value: 'sensitive skin' },
              ],
            },
            budgetQuestion(currency, 100),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'dermatological-skincare',
        name: 'Dermatological Skincare',
        icon: 'cross.case.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'concern',
              text: 'What skin condition?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'eczema', label: 'Eczema', value: 'eczema treatment' },
                { id: 'psoriasis', label: 'Psoriasis', value: 'psoriasis treatment' },
                { id: 'rosacea', label: 'Rosacea', value: 'rosacea treatment' },
                { id: 'sensitive', label: 'Very Sensitive Skin', value: 'dermatological sensitive' },
              ],
            },
            budgetQuestion(currency, 100),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'makeup',
        name: 'Make-up',
        icon: 'paintbrush.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What makeup product?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'face', label: 'Face (Foundation, Concealer)', value: 'foundation concealer' },
                { id: 'eyes', label: 'Eyes (Mascara, Eyeshadow)', value: 'mascara eyeshadow' },
                { id: 'lips', label: 'Lips (Lipstick, Gloss)', value: 'lipstick lip gloss' },
                { id: 'brushes', label: 'Brushes & Tools', value: 'makeup brushes tools' },
              ],
            },
            budgetQuestion(currency, 100),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'nail-care',
        name: 'Nail Care',
        icon: 'hand.raised.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What do you need?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'polish', label: 'Nail Polish', value: 'nail polish' },
                { id: 'gel', label: 'Gel Nails', value: 'gel nail kit' },
                { id: 'tools', label: 'Nail Tools', value: 'nail tools manicure' },
                { id: 'treatment', label: 'Nail Treatment', value: 'nail treatment strengthener' },
              ],
            },
            budgetQuestion(currency, 50),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'bath-body',
        name: 'Bath & Body',
        icon: 'drop.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'bodywash', label: 'Body Wash / Shower Gel', value: 'body wash shower gel' },
                { id: 'lotion', label: 'Body Lotion / Cream', value: 'body lotion cream' },
                { id: 'scrub', label: 'Body Scrub', value: 'body scrub exfoliator' },
                { id: 'bath', label: 'Bath Products', value: 'bath bombs bubble bath' },
              ],
            },
            budgetQuestion(currency, 50),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'fragrance',
        name: 'Fragrance',
        icon: 'aqi.medium',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'gender',
              text: 'Who is it for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'women', label: 'Women', value: 'women perfume' },
                { id: 'men', label: 'Men', value: 'men cologne' },
                { id: 'unisex', label: 'Unisex', value: 'unisex fragrance' },
              ],
            },
            {
              id: 'type',
              text: 'Fragrance type?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'edp', label: 'Eau de Parfum', value: 'eau de parfum' },
                { id: 'edt', label: 'Eau de Toilette', value: 'eau de toilette' },
                { id: 'cologne', label: 'Cologne', value: 'cologne' },
              ],
            },
            budgetQuestion(currency, 200),
          ],
        },
      },
      {
        id: 'mens-grooming',
        name: "Men's Grooming",
        icon: 'mustache.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What grooming product?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'shaving', label: 'Shaving', value: 'razor shaving' },
                { id: 'beard', label: 'Beard Care', value: 'beard oil trimmer' },
                { id: 'skincare', label: 'Skincare', value: 'men skincare' },
                { id: 'haircare', label: 'Hair Care', value: 'men hair care styling' },
              ],
            },
            budgetQuestion(currency, 100),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'health-personal-care',
        name: 'Health & Personal Care',
        icon: 'heart.text.square.fill',
        categoryId: 'beauty',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What do you need?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'dental', label: 'Dental Care', value: 'toothbrush toothpaste' },
                { id: 'vitamins', label: 'Vitamins & Supplements', value: 'vitamins supplements' },
                { id: 'firstaid', label: 'First Aid', value: 'first aid kit' },
                { id: 'massage', label: 'Massage & Relaxation', value: 'massage relaxation' },
              ],
            },
            budgetQuestion(currency, 100),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
    ],
  },

  // =====================
  // FILMS, TV, MUSIC & GAMES
  // =====================
  {
    id: 'entertainment',
    name: 'Films, TV, Music & Games',
    icon: 'film.fill',
    description: 'DVDs, music & instruments',
    subcategories: [
      {
        id: 'dvd-bluray',
        name: 'DVD & Blu-ray',
        icon: 'opticaldisc.fill',
        categoryId: 'entertainment',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What are you looking for?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'movies', label: 'Movies', value: 'blu-ray DVD movies' },
                { id: 'tvseries', label: 'TV Series', value: 'TV series box set' },
                { id: '4k', label: '4K Ultra HD', value: '4K UHD blu-ray' },
                { id: 'boxset', label: 'Box Sets', value: 'box set collection' },
              ],
            },
            {
              id: 'genre',
              text: 'Preferred genre?',
              type: 'single_select',
              required: false,
              options: [
                { id: 'action', label: 'Action', value: 'action' },
                { id: 'comedy', label: 'Comedy', value: 'comedy' },
                { id: 'drama', label: 'Drama', value: 'drama' },
                { id: 'scifi', label: 'Sci-Fi', value: 'sci-fi' },
                { id: 'horror', label: 'Horror', value: 'horror' },
                { id: 'family', label: 'Family', value: 'family' },
              ],
            },
            budgetQuestion(currency, 50),
          ],
        },
      },
      {
        id: 'cds-vinyl',
        name: 'CDs & Vinyl',
        icon: 'opticaldisc.fill',
        categoryId: 'entertainment',
        questionFlow: {
          questions: [
            {
              id: 'format',
              text: 'What format?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'vinyl', label: 'Vinyl Records', value: 'vinyl records LP' },
                { id: 'cd', label: 'CDs', value: 'music CD' },
              ],
            },
            {
              id: 'genre',
              text: 'Music genre?',
              type: 'single_select',
              required: false,
              options: [
                { id: 'rock', label: 'Rock', value: 'rock' },
                { id: 'pop', label: 'Pop', value: 'pop' },
                { id: 'hiphop', label: 'Hip-Hop', value: 'hip-hop rap' },
                { id: 'classical', label: 'Classical', value: 'classical' },
                { id: 'jazz', label: 'Jazz', value: 'jazz' },
                { id: 'electronic', label: 'Electronic', value: 'electronic dance' },
              ],
            },
            budgetQuestion(currency, 50),
          ],
        },
      },
      {
        id: 'musical-instruments',
        name: 'Musical Instruments & DJ',
        icon: 'guitars.fill',
        categoryId: 'entertainment',
        questionFlow: {
          questions: [
            {
              id: 'type',
              text: 'What instrument?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'guitar', label: 'Guitar', value: 'guitar acoustic electric' },
                { id: 'keyboard', label: 'Keyboard / Piano', value: 'keyboard piano' },
                { id: 'drums', label: 'Drums', value: 'drums drum kit' },
                { id: 'dj', label: 'DJ Equipment', value: 'DJ controller mixer' },
                { id: 'other', label: 'Other Instruments', value: 'musical instruments' },
              ],
            },
            budgetQuestion(currency, 1000),
            prioritiesQuestion(defaultPriorities),
          ],
        },
      },
      {
        id: 'entertainment-games',
        name: 'PC & Video Games',
        icon: 'gamecontroller.fill',
        categoryId: 'entertainment',
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
  // BOOKS
  // =====================
  {
    id: 'books',
    name: 'Books',
    icon: 'book.fill',
    description: 'Books & reading',
    subcategories: [
      {
        id: 'books-general',
        name: 'All Books',
        icon: 'books.vertical.fill',
        categoryId: 'books',
        questionFlow: {
          questions: [
            {
              id: 'format',
              text: 'What format?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'paperback', label: 'Paperback', value: 'paperback book' },
                { id: 'hardback', label: 'Hardback', value: 'hardback hardcover book' },
                { id: 'ebook', label: 'eBook', value: 'ebook kindle' },
                { id: 'audiobook', label: 'Audiobook', value: 'audiobook' },
              ],
            },
            {
              id: 'genre',
              text: 'What genre?',
              type: 'single_select',
              required: true,
              options: [
                { id: 'fiction', label: 'Fiction', value: 'fiction novel' },
                { id: 'nonfiction', label: 'Non-Fiction', value: 'non-fiction' },
                { id: 'children', label: "Children's", value: 'children books' },
                { id: 'education', label: 'Education & Reference', value: 'education textbook' },
                { id: 'selfhelp', label: 'Self-Help', value: 'self-help' },
                { id: 'biography', label: 'Biography', value: 'biography autobiography' },
              ],
            },
            budgetQuestion(currency, 50),
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
