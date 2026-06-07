import type { ICategory } from "./categories";

export interface IProduct {
  id: string;
  categoryId: string;
  category: ICategory;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string;
  sortOrder: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
