export interface IProduct {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  sortOrder: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
