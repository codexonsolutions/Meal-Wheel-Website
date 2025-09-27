import { Restaurant, MenuCategory, MenuItem } from "@/types";

// Helper function to create menu items
const createMenuItem = (name: string, price: number, category: string, featured = false, image?: string): MenuItem => ({
  id: `${category}-${name.toLowerCase().replace(/\s+/g, '-')}`,
  name,
  price,
  category,
  featured,
  image
});

// Food images for different categories
const getFoodImage = (category: string, itemName: string): string => {
  const imageMap: { [key: string]: string } = {
    'Tandoor': '/f1.png',
    'Gravy': '/f2.png',
    'Sajji Menu': '/f3.png',
    'Specialty Flat Breads': '/f1.png',
    'Traditional': '/f2.png',
    'Wraps': '/f3.png',
    'Shawarma': '/f1.png',
    'Breakfast': '/f2.png',
    'Drinks': '/f2.png',
    'Thanda': '/f3.png',
    'Garam': '/f1.png',
    'Meetha': '/f2.png',
    'Curry Platters': '/f3.png',
    'WAP Currys (2 Persons Serving)': '/f1.png',
    'Rice Bowls': '/f2.png',
    'Chicken Mandi': '/f3.png',
    'Arabic / Turkish Shawarmas': '/f1.png',
    'Crispy Chicken Wraps': '/f2.png',
    'Shawarma Platters': '/f3.png',
    'Make It a Meal': '/f1.png',
    'Add Ons': '/f2.png',
    'Thaal Menu': '/f3.png',
    'Tandoor (Breads)': '/f1.png',
    'Extras': '/f2.png'
  };
  
  return imageMap[category] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center';
};

// Khabbay Restaurant Data
const khabbayTandoorItems: MenuItem[] = [
  createMenuItem("Tandoori Tikka Piece (Leg/Chest)", 574, "Tandoor", false, getFoodImage("Tandoor", "Tandoori Tikka")),
  createMenuItem("Malai Tikka Piece (Leg)", 643, "Tandoor", false, getFoodImage("Tandoor", "Malai Tikka")),
  createMenuItem("Patakha Tikka Piece (Leg)", 620, "Tandoor", false, getFoodImage("Tandoor", "Patakha Tikka")),
  createMenuItem("Tandoori Boti Half (8 Pieces)", 1080, "Tandoor", false, getFoodImage("Tandoor", "Tandoori Boti")),
  createMenuItem("Tandoori Boti Full (16 Pieces)", 2092, "Tandoor", false, getFoodImage("Tandoor", "Tandoori Boti")),
  createMenuItem("Malai Boti Half (8 Pieces)", 1206, "Tandoor", false, getFoodImage("Tandoor", "Malai Boti")),
  createMenuItem("Malai Boti Full (16 Pieces)", 2368, "Tandoor", false, getFoodImage("Tandoor", "Malai Boti")),
  createMenuItem("Patakha Boti Half (8 Pieces)", 1126, "Tandoor", false, getFoodImage("Tandoor", "Patakha Boti")),
  createMenuItem("Patakha Boti Full (16 Pieces)", 2218, "Tandoor", false, getFoodImage("Tandoor", "Patakha Boti")),
  createMenuItem("Rajhistani Boti Half (8 Pieces)", 1160, "Tandoor", false, getFoodImage("Tandoor", "Rajhistani Boti")),
  createMenuItem("Rajhistani Boti Full (16 Pieces)", 2287, "Tandoor", false, getFoodImage("Tandoor", "Rajhistani Boti")),
  createMenuItem("Kabab Khabbay (4 Pieces)", 1126, "Tandoor", true, getFoodImage("Tandoor", "Kabab Khabbay")),
  createMenuItem("Cheese Seekh Kabab (4 Pieces)", 1390, "Tandoor", true, getFoodImage("Tandoor", "Cheese Seekh Kabab")),
];

const khabbayGravyItems: MenuItem[] = [
  createMenuItem("Chicken Karahi Half", 1563, "Gravy"),
  createMenuItem("Chicken Karahi Full", 2609, "Gravy"),
  createMenuItem("Chicken Makhni Karahi Half", 1896, "Gravy"),
  createMenuItem("Chicken Makhni Karahi Full", 2989, "Gravy"),
  createMenuItem("Qeema Half", 1942, "Gravy"),
  createMenuItem("Qeema Full", 2920, "Gravy"),
  createMenuItem("Mirchill Karahi Half", 2322, "Gravy"),
  createMenuItem("Mirchill Karahi Full", 3242, "Gravy"),
  createMenuItem("Chicken Handi Half", 2034, "Gravy"),
  createMenuItem("Chicken Handi Full", 2851, "Gravy"),
  createMenuItem("Chicken Makhni Handi Half", 2195, "Gravy"),
  createMenuItem("Chicken Makhni Handi Full", 3081, "Gravy"),
  createMenuItem("White Handi Half", 2333, "Gravy"),
  createMenuItem("White Handi Full", 3253, "Gravy"),
  createMenuItem("Chicken Jalfrezi Half", 2184, "Gravy"),
  createMenuItem("Chicken Jalfrezi Full", 3115, "Gravy"),
  createMenuItem("Chicken ginger handi half", 2103, "Gravy"),
  createMenuItem("Chicken ginger handi full", 2908, "Gravy"),
  createMenuItem("Kabab Masala half", 2149, "Gravy"),
  createMenuItem("Kabab Masala full", 2966, "Gravy"),
];

const khabbayBreadItems: MenuItem[] = [
  createMenuItem("Roti", 69, "Tandoor (Breads)"),
  createMenuItem("Naan", 69, "Tandoor (Breads)"),
  createMenuItem("Roghni Naan", 173, "Tandoor (Breads)"),
  createMenuItem("Kalonji Naan", 173, "Tandoor (Breads)"),
  createMenuItem("Kulcha", 173, "Tandoor (Breads)"),
  createMenuItem("Garlic Naan", 184, "Tandoor (Breads)"),
];

const khabbayExtrasItems: MenuItem[] = [
  createMenuItem("Plain Rice", 401, "Extras"),
  createMenuItem("Arabian Rice", 401, "Extras"),
  createMenuItem("Raita", 104, "Extras"),
  createMenuItem("Mint Raita", 104, "Extras"),
  createMenuItem("Salad", 138, "Extras"),
];

const khabbayDrinksItems: MenuItem[] = [
  createMenuItem("Soft Drink Regular 250ml", 102, "Drinks"),
  createMenuItem("Soft Drink Can 250ml", 150, "Drinks"),
  createMenuItem("Soft Drink 1 Litre", 218, "Drinks"),
  createMenuItem("Soft Drink 1.5 Litre", 288, "Drinks"),
  createMenuItem("Mineral Water 500ml", 92, "Drinks"),
  createMenuItem("Mineral Water 1.5 Litre", 155, "Drinks"),
  createMenuItem("Fresh Lime", 194, "Drinks"),
];

const khabbaySajjiItems: MenuItem[] = [
  createMenuItem("Khabbay Special Sajji", 804, "Sajji Menu", true, getFoodImage("Sajji Menu", "Khabbay Special Sajji")),
  createMenuItem("Special Flavored Sajji (Quarter)", 875, "Sajji Menu", false, getFoodImage("Sajji Menu", "Special Flavored Sajji")),
  createMenuItem("Full Sajji with Rice", 2989, "Sajji Menu", false, getFoodImage("Sajji Menu", "Full Sajji")),
  createMenuItem("Full Masala Sajji without Rice", 1954, "Sajji Menu", false, getFoodImage("Sajji Menu", "Masala Sajji")),
  createMenuItem("Full Flavored Sajji without Rice", 2368, "Sajji Menu", false, getFoodImage("Sajji Menu", "Flavored Sajji")),
  createMenuItem("Half Flavored Sajji with Rice", 1747, "Sajji Menu", false, getFoodImage("Sajji Menu", "Half Sajji")),
  createMenuItem("Flavoured Sajji (quarter) without rice", 1747, "Sajji Menu", false, getFoodImage("Sajji Menu", "Quarter Sajji")),
  createMenuItem("Masala Sajji without rice (Quarter)", 505, "Sajji Menu", false, getFoodImage("Sajji Menu", "Quarter Masala")),
  createMenuItem("Full flavoured Sajji with rice", 3501, "Sajji Menu", false, getFoodImage("Sajji Menu", "Full Flavored Sajji")),
];

const khabbayThaalItems: MenuItem[] = [
  createMenuItem("Namkeen Rice Thaal", 3357, "Thaal Menu"),
  createMenuItem("Namkeen Naan Thaal", 3000, "Thaal Menu"),
];

// Wrap Lab Restaurant Data
const wrapLabSpecialtyItems: MenuItem[] = [
  createMenuItem("Beef Cheese Steak", 857, "Specialty Flat Breads"),
  createMenuItem("Chicken Cheese Tikka", 742, "Specialty Flat Breads"),
  createMenuItem("Pizza Paratha", 730, "Specialty Flat Breads"),
  createMenuItem("Creamy Mushroom Chicken", 719, "Specialty Flat Breads"),
  createMenuItem("Pepperoni Cheese", 707, "Specialty Flat Breads"),
  createMenuItem("Chicken Hara Masala", 696, "Specialty Flat Breads"),
  createMenuItem("Three Cheese Paratha", 661, "Specialty Flat Breads"),
  createMenuItem("Chicken Cheese Qeema", 673, "Specialty Flat Breads"),
  createMenuItem("Smoked Barbecue Chicken", 684, "Specialty Flat Breads"),
];

const wrapLabTraditionalItems: MenuItem[] = [
  createMenuItem("Chicken Qeema Paratha", 489, "Traditional"),
  createMenuItem("Aloo Cheese Paratha", 408, "Traditional"),
  createMenuItem("Aloo Paratha", 293, "Traditional"),
  createMenuItem("Warqi Paratha", 167, "Traditional"),
];

const wrapLabWrapsItems: MenuItem[] = [
  createMenuItem("Chicken Malai Boti", 569, "Wraps"),
  createMenuItem("Barbecue Tikka Wrap", 558, "Wraps"),
  createMenuItem("Tandoori Garlic Mayo", 546, "Wraps"),
  createMenuItem("Chicken Tandoori", 535, "Wraps"),
  createMenuItem("Chicken Cheese Kabab", 523, "Wraps"),
  createMenuItem("Chicken Kabab Wrap", 454, "Wraps"),
];

const wrapLabMeethaItems: MenuItem[] = [
  createMenuItem("Nutella Paratha", 546, "Meetha"),
  createMenuItem("Cinnamon Butter Paratha", 282, "Meetha"),
  createMenuItem("Meetha Paratha", 224, "Meetha"),
];

const wrapLabBreakfastItems: MenuItem[] = [
  createMenuItem("Nutella French Toast", 512, "Breakfast"),
  createMenuItem("Pepperoni Cheese Omelette", 443, "Breakfast"),
  createMenuItem("Mushroom Cheese Omelette", 431, "Breakfast"),
  createMenuItem("Cheese Omelette", 420, "Breakfast"),
  createMenuItem("Spanish Omelette", 408, "Breakfast"),
  createMenuItem("Pakistani Omelette", 397, "Breakfast"),
  createMenuItem("French Toast", 385, "Breakfast"),
];

const wrapLabThandaItems: MenuItem[] = [
  createMenuItem("Mint Margarita (Salted/Sweet)", 282, "Thanda"),
  createMenuItem("Lassi Sweet/Salty", 293, "Thanda"),
  createMenuItem("Fresh Lime with Sprite", 201, "Thanda"),
  createMenuItem("Water 500ml", 86, "Thanda"),
  createMenuItem("Drink (345ml)", 109, "Thanda"),
  createMenuItem("Drink (500ml)", 167, "Thanda"),
  createMenuItem("Drink (250ml Can)", 144, "Thanda"),
];

const wrapLabGaramItems: MenuItem[] = [
  createMenuItem("Doodh Patti", 270, "Garam"),
  createMenuItem("Karak Chaye", 224, "Garam"),
  createMenuItem("Green Tea", 144, "Garam"),
];

const wrapLabCurryPlattersItems: MenuItem[] = [
  createMenuItem("Butter Chicken, Palak Paneer, Daal Makhni, Salad, Mint Sauce, Paratha x2", 1489, "Curry Platters"),
  createMenuItem("Boneless Handi, Achari Aloo Bhujia, Daal Makhni, Mint Sauce, Salad, Paratha x2", 1087, "Curry Platters"),
  createMenuItem("Malai Boti, Achari Aloo Bhujia, Daal Makhni, Mint Sauce, Salad, Paratha x2", 1029, "Curry Platters"),
  createMenuItem("Achari Chicken, Achari Aloo Bhujia, Daal Makhni, Mint Sauce, Salad, Paratha x2", 972, "Curry Platters"),
  createMenuItem("Kabab Masala, Achari Aloo Bhujia, Daal Makhni, Mint Sauce, Salad, Paratha x2", 914, "Curry Platters"),
];

const wrapLabWapCurrysItems: MenuItem[] = [
  createMenuItem("Butter Chicken Handi", 1662, "WAP Currys (2 Persons Serving)"),
  createMenuItem("Palak Paneer Handi", 1547, "WAP Currys (2 Persons Serving)"),
  createMenuItem("Boneless Handi", 1374, "WAP Currys (2 Persons Serving)"),
  createMenuItem("Malai Boti", 1351, "WAP Currys (2 Persons Serving)"),
  createMenuItem("Achari Chicken", 1328, "WAP Currys (2 Persons Serving)"),
  createMenuItem("Kabab Masala", 1305, "WAP Currys (2 Persons Serving)"),
  createMenuItem("Saag (Seasonal)", 569, "WAP Currys (2 Persons Serving)"),
  createMenuItem("Achari Aloo Bhujia", 546, "WAP Currys (2 Persons Serving)"),
  createMenuItem("Daal Makhni", 523, "WAP Currys (2 Persons Serving)"),
];

// Wrap Lab Shawarma Data
const wrapLabRiceBowlsItems: MenuItem[] = [
  createMenuItem("Shawarma Chicken", 804, "Rice Bowls"),
  createMenuItem("Crispy Chicken", 804, "Rice Bowls"),
];

const wrapLabChickenMandiItems: MenuItem[] = [
  createMenuItem("Chicken Mandi Quarter", 1139, "Chicken Mandi"),
  createMenuItem("Chicken Mandi Half", 2174, "Chicken Mandi"),
  createMenuItem("Chicken Mandi Full", 4014, "Chicken Mandi"),
];

const wrapLabSpecialItems: MenuItem[] = [
  createMenuItem("Humus with Shawarma Chicken", 976, "Wrap Lab Special"),
  createMenuItem("Loaded Fries", 804, "Wrap Lab Special"),
  createMenuItem("Humus with Pita Bread", 747, "Wrap Lab Special"),
];

const wrapLabShawarmaItems: MenuItem[] = [
  createMenuItem("Shawarma Al Sham (Spicy Garlic)", 919, "Arabic / Turkish Shawarmas"),
  createMenuItem("Shawarma Al Arab (Authentic Arabic)", 862, "Arabic / Turkish Shawarmas"),
];

const wrapLabCrispyChickenItems: MenuItem[] = [
  createMenuItem("Texas BBQ", 862, "Crispy Chicken Wraps"),
  createMenuItem("Jalapeno (Tangy)", 862, "Crispy Chicken Wraps"),
  createMenuItem("Mexican (Sweet & Spicy)", 862, "Crispy Chicken Wraps"),
  createMenuItem("Chipotle (Hot)", 862, "Crispy Chicken Wraps"),
];

const wrapLabAllWrapBoxItems: MenuItem[] = [
  createMenuItem("All Wrap Box (Choose any 4 wraps + dips, fries & 1.5L drink)", 3909, "All Wrap Box"),
];

const wrapLabShawarmaPlattersItems: MenuItem[] = [
  createMenuItem("Al Arab Family Platter", 4139, "Shawarma Platters"),
  createMenuItem("Al Sham Family Platter", 3909, "Shawarma Platters"),
  createMenuItem("Single Shawarma Platter Al Sham", 1551, "Shawarma Platters"),
  createMenuItem("Single Shawarma Platter Al Arab", 1321, "Shawarma Platters"),
];

const wrapLabMakeItMealItems: MenuItem[] = [
  createMenuItem("Fries with Peach Ice Tea", 401, "Make It a Meal"),
  createMenuItem("Fries with Lemonade", 401, "Make It a Meal"),
  createMenuItem("Fries + Drink", 287, "Make It a Meal"),
];

const wrapLabAddOnsItems: MenuItem[] = [
  createMenuItem("Peach Ice Tea", 344, "Add Ons"),
  createMenuItem("Lemonade", 344, "Add Ons"),
  createMenuItem("Fries", 287, "Add Ons"),
  createMenuItem("Extra Dip", 114, "Add Ons"),
  createMenuItem("Soft Drink", 114, "Add Ons"),
  createMenuItem("Water", 56, "Add Ons"),
  createMenuItem("Bread", 56, "Add Ons"),
];

// Restaurant data
export const restaurants: Restaurant[] = [
  {
    id: "khabbay",
    name: "Khabbay ki Sajji",
    slug: "khabbay",
    description: "Authentic Pakistani cuisine with traditional tandoor and sajji specialties",
    image: "/f1.png",
    categories: ["Tandoor", "Gravy", "Sajji", "Thaal", "Breads", "Drinks"],
    createdAt: Date.now(),
  },
  {
    id: "wrap-lab",
    name: "Wrap Lab",
    slug: "wrap-lab",
    description: "Modern wraps, parathas, and international fusion cuisine",
    image: "/f2.png",
    categories: ["Specialty Flat Breads", "Traditional", "Wraps", "Shawarma", "Breakfast", "Drinks"],
    createdAt: Date.now(),
  },
];

// Menu categories for each restaurant
export const khabbayMenuCategories: MenuCategory[] = [
  { name: "Tandoor", items: khabbayTandoorItems },
  { name: "Gravy", items: khabbayGravyItems },
  { name: "Tandoor (Breads)", items: khabbayBreadItems },
  { name: "Extras", items: khabbayExtrasItems },
  { name: "Drinks", items: khabbayDrinksItems },
  { name: "Sajji Menu", items: khabbaySajjiItems },
  { name: "Thaal Menu", items: khabbayThaalItems },
];

export const wrapLabMenuCategories: MenuCategory[] = [
  { name: "Specialty Flat Breads", items: wrapLabSpecialtyItems },
  { name: "Traditional", items: wrapLabTraditionalItems },
  { name: "Wraps", items: wrapLabWrapsItems },
  { name: "Meetha", items: wrapLabMeethaItems },
  { name: "Breakfast", items: wrapLabBreakfastItems },
  { name: "Thanda", items: wrapLabThandaItems },
  { name: "Garam", items: wrapLabGaramItems },
  { name: "Curry Platters", items: wrapLabCurryPlattersItems },
  { name: "WAP Currys (2 Persons Serving)", items: wrapLabWapCurrysItems },
  { name: "Rice Bowls", items: wrapLabRiceBowlsItems },
  { name: "Chicken Mandi", items: wrapLabChickenMandiItems },
  { name: "Wrap Lab Special", items: wrapLabSpecialItems },
  { name: "Arabic / Turkish Shawarmas", items: wrapLabShawarmaItems },
  { name: "Crispy Chicken Wraps", items: wrapLabCrispyChickenItems },
  { name: "All Wrap Box", items: wrapLabAllWrapBoxItems },
  { name: "Shawarma Platters", items: wrapLabShawarmaPlattersItems },
  { name: "Make It a Meal", items: wrapLabMakeItMealItems },
  { name: "Add Ons", items: wrapLabAddOnsItems },
];

// Get restaurant by slug
export const getRestaurantBySlug = (slug: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.slug === slug);
};

// Get menu categories for a restaurant
export const getMenuCategories = (restaurantId: string): MenuCategory[] => {
  switch (restaurantId) {
    case "khabbay":
      return khabbayMenuCategories;
    case "wrap-lab":
      return wrapLabMenuCategories;
    default:
      return [];
  }
};

// Get all featured items across all restaurants
export const getFeaturedItems = (): MenuItem[] => {
  const allItems: MenuItem[] = [];
  
  khabbayMenuCategories.forEach(category => {
    allItems.push(...category.items.filter(item => item.featured));
  });
  
  wrapLabMenuCategories.forEach(category => {
    allItems.push(...category.items.filter(item => item.featured));
  });
  
  return allItems;
};
