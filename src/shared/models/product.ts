import type { ICategory } from "./category";

export interface IProduct {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProductWithCategory extends IProduct {
  category: ICategory;
}
