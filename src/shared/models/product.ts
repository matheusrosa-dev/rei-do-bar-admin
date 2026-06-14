export interface IProduct {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
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
  sortOrder: number;
  isActive: boolean;
}

export interface IProductWithCategory extends IProduct {
  category: ICategory;
}
