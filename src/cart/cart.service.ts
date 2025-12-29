import { storage } from "./cart.storage";
import { AppError } from "../errors/AppError";
import { AddToCartParams, Cart, RemoveCartParams } from "./types";

const getCart = async (userId: string) => {
  return await storage.getByUserId(userId);
};

const addToCart = async ({ userId, product }: AddToCartParams) => {
  if (!product || !product.id) {
    throw new AppError("Product is required", 400);
  }

  const cart = (await await storage.getByUserId(userId)) as Cart;

  const existing = cart.items.find((i) => i.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ ...product, quantity: 1 });
  }

  return await storage.save(cart);
};

const removeFromCart = async ({ userId, productId }: RemoveCartParams) => {
  const cart = (await await storage.getByUserId(userId)) as Cart;

  cart.items = cart.items.filter((i) => i.id !== productId);
  return await storage.save(cart);
};

const clearCart = async (userId: string) => {
  const cart = { userId, items: [] };
  return await storage.save(cart);
};

export const service = {
  clearCart,
  removeFromCart,
  addToCart,
  getCart,
};
