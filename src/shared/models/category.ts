import type { IProductWithCategory } from "./product";

export interface ICategoryGroup {
  id: string;
  name: string;
  allProductsImageUrl: string;
  promotionsImageUrl: string;
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

export interface ICategoryWithGroup extends ICategoryWithProductsCount {
  categoryGroup: ICategoryGroup;
}

export interface ICategoryGroupWithCategories extends ICategoryGroup {
  categories: ICategoryWithProductsCount[];
}

export interface ICategoryGroupWithCategoryRows extends ICategoryGroup {
  categories: ICategory[];
}

export interface ICategoryGroupWithProducts extends ICategoryGroup {
  products: IProductWithCategory[];
}
