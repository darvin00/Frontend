export interface Product {
  keybenefit: any;
  id: number; // Optional since it might be autogenerated
  favorited?: boolean;
  rating?: number;
  shine?: boolean;
  sheShine?: boolean;
  subcategory?: string;
  category?: string;
  mainImage?: string; // Renamed to camelCase
 cards?: Array<{ image: string; title: string; text: string }>;// Define Card interface as well
  images?: string[];
  threeDImages?: string[];
  thumbnail?: string;
  title?: string;
  name?: string;
  benefit?: string;
  suitable?: string;
  description?: string;
  keyBenefit?: string; // Renamed to camelCase
  howToUse?: string;
  ingredients?: string;
  size?: string;
  mrp?: number;
  price?: number;
  stockQuantity?: number;
  discount?: number;
  averageRating?: number;
  feature?: boolean; // New
  trend?: boolean; // New
  special?: boolean; // New
  specialLine?: string;
  color?: string;
} 






