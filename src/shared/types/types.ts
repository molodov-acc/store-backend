export type Gender = "male" | "female";

export interface Product {
  id: string;
  title: string;
  categoryId: number;
  brandId: number;
  gender: Gender;
  sizes: string[];
  colors: string[];
  price: number;
  image: string;
}
