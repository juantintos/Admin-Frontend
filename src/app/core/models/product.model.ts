export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ProductForm {
  name: string;
  brand: string;
  price: number;
}

export interface ProductFilters {
  search?: string;
  price_min?: number;
  price_max?: number;
  per_page?: number;
  page?: number;
}