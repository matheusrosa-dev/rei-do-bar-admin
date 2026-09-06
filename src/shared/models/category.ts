export interface ICategoryGroup {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  pluralName: string;
  categoryGroupId: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryWithProductsCount extends ICategory {
  productsCount: number;
}

export interface ICategoryGroupWithCategories extends ICategoryGroup {
  categories: ICategoryWithProductsCount[];
}
