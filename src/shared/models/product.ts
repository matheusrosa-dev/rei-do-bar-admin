export interface IProduct {
  id: string;
  categoryId: string;
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

export interface ICategory {
  id: string;
  name: string;
  pluralName: string;
  isActive: boolean;
}

export interface IProductWithCategory extends IProduct {
  category: ICategory;
}
