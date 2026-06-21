export interface IProduct {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  pluralName: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export interface IProductWithCategory extends IProduct {
  category: ICategory;
}
