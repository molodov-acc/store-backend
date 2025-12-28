export interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  [key: string]: any;
}

export interface AddToCartParams {
  userId: string;
  product: Product;
}
export interface RemoveCartParams extends Omit<AddToCartParams, "product"> {
  productId: string;
}
