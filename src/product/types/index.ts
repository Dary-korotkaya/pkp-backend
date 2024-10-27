import { ProductType } from '../../supplier/supplier.entity';

export enum ProductTypeShorted {
  FRUITS_AND_VEGETABLES = 'Fruits-and-vegetables',
  DAIRY_PRODUCTS = 'Dairy-products',
  MEAT = 'Meat-and-poultry',
  FISH = 'Fish-and-seafood',
  BAKERY_PRODUCTS = 'Bakery-products',
  CANNED_FOOD = 'Canned-food',
  FROZEN_FOOD = 'Frozen-food',
  SWEETS = 'Sweets-and-snacks',
  BEVERAGES = 'Beverages',
  SPICES = 'Spices-and-seasonings',
}

export const ProductTypeFull: Record<ProductTypeShorted, ProductType> = {
  [ProductTypeShorted.FRUITS_AND_VEGETABLES]: ProductType.FRUITS_AND_VEGETABLES,
  [ProductTypeShorted.DAIRY_PRODUCTS]: ProductType.DAIRY_PRODUCTS,
  [ProductTypeShorted.MEAT]: ProductType.MEAT,
  [ProductTypeShorted.FISH]: ProductType.FISH,
  [ProductTypeShorted.BAKERY_PRODUCTS]: ProductType.BAKERY_PRODUCTS,
  [ProductTypeShorted.CANNED_FOOD]: ProductType.CANNED_FOOD,
  [ProductTypeShorted.FROZEN_FOOD]: ProductType.FROZEN_FOOD,
  [ProductTypeShorted.SWEETS]: ProductType.SWEETS,
  [ProductTypeShorted.BEVERAGES]: ProductType.BEVERAGES,
  [ProductTypeShorted.SPICES]: ProductType.SPICES,
};
