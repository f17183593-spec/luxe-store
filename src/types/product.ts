export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number; // USD cents
  images: string[];
  category: string;
  tags: string[];
  material?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCardData {
  slug: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "newest";
}
