import { Product } from "../shared/types/types";

export interface Cart {
  userId: string;
  items: CartItem[];
}
export interface CartItem extends Product {
  quantity: number;
}

export interface AddToCartParams {
  userId: string;
  product: Product;
}
export interface RemoveCartParams extends Omit<AddToCartParams, "product"> {
  productId: string;
}
