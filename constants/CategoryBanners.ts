export const CATEGORY_BANNERS: Record<string, any> = {
  'restaurants_cafes': require('../assets/images/categories/restaurants_cafes.jpg'),
  'beauty_for_women': require('../assets/images/categories/beauty_for_women.jpg'),
  'grooming_for_men': require('../assets/images/categories/grooming_for_men.jpg'),
  'fitness_gym': require('../assets/images/categories/fitness_gym.jpg'),
  'it_software': require('../assets/images/categories/it_software.jpg'),
  'retail': require('../assets/images/categories/retail.jpg'),
  'fashion_clothing': require('../assets/images/categories/fashion_clothing.jpg'),
  'automotive': require('../assets/images/categories/automotive.jpg'),
  // 'travel_tourism': require('../assets/images/categories/travel_tourism.jpg'),
  'spa': require('../assets/images/categories/spa.jpg'),
  'health_wellness': require('../assets/images/categories/health_wellness.jpg'),
  'electronics': require('../assets/images/categories/electronics.jpg'),
  'home_services': require('../assets/images/categories/home_services.jpg'),
  'cleaning_services': require('../assets/images/categories/cleaning_services.jpg'),
  'education': require('../assets/images/categories/education.jpg'),
  'realestate': require('../assets/images/categories/realestate.jpg'),
  'finance': require('../assets/images/categories/finance.jpg'),

  // Semantic reuses for better coverage
  'food-beverages': require('../assets/images/categories/restaurants_cafes.jpg'),
  'coffee-cafes': require('../assets/images/categories/restaurants_cafes.jpg'),
  'pharmacy': require('../assets/images/categories/health_wellness.jpg'),
  'medical': require('../assets/images/categories/health_wellness.jpg'),
  'groceries': require('../assets/images/categories/retail.jpg'),
  'food-delivery': require('../assets/images/categories/restaurants_cafes.jpg'),
  'logistics': require('../assets/images/categories/automotive.jpg'),
  'photography': require('../assets/images/categories/it_software.jpg'), // Will fallback to gradient if events-entertainment missing, or I can use it_software for digital feel
  'construction': require('../assets/images/categories/home_services.jpg'),

  // Additional semantic reuses for missing cards from UI
  'car-rental': require('../assets/images/categories/automotive.jpg'),
  'car-repair': require('../assets/images/categories/automotive.jpg'),
  'bakery': require('../assets/images/categories/restaurants_cafes.jpg'),
  'cafe': require('../assets/images/categories/restaurants_cafes.jpg'),
  'fast-food': require('../assets/images/categories/restaurants_cafes.jpg'),
  'food-snacks': require('../assets/images/categories/restaurants_cafes.jpg'),
  'it-company': require('../assets/images/categories/it_software.jpg'),
  'clinic': require('../assets/images/categories/health_wellness.jpg'),
  'health-medical': require('../assets/images/categories/health_wellness.jpg'),
  'supermarket': require('../assets/images/categories/retail.jpg'),

  // Exact slugs from backend API for missing elements
  'electronic': require('../assets/images/categories/electronics.jpg'),
  'restaurants': require('../assets/images/categories/restaurants_cafes.jpg'),
  'health': require('../assets/images/categories/health_wellness.jpg'),
  'restaurants-muscat': require('../assets/images/categories/restaurants_cafes.jpg'),
};


export function getCategoryBanner(slug: string) {
  return CATEGORY_BANNERS[slug] || null;
}
