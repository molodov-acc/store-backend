import { storage } from "./cart.storage";
import { AppError } from "../errors/AppError";
import { AddToCartParams, RemoveCartParams } from "./types";

const getCart = (userId: string) => {
  return storage.getByUserId(userId);
};

// TODO fix any type
const addToCart = ({ userId, product }: AddToCartParams) => {
  if (!product || !product.id) {
    throw new AppError("Product is required", 400);
  }

  const cart = storage.getByUserId(userId);

  // TODO fix any type
  const existing = cart.items.find((i: any) => i.id === product.id);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.items.push({ ...product, quantity: product.quantity || 1 });
  }

  return storage.save(cart);
};

const removeFromCart = ({ userId, productId }: RemoveCartParams) => {
  const cart = storage.getByUserId(userId);
  cart.items = cart.items.filter((i) => i.id !== productId);
  return storage.save(cart);
};

const clearCart = (userId: string) => {
  const cart = { userId, items: [] };
  return storage.save(cart);
};

export const service = {
  clearCart,
  removeFromCart,
  addToCart,
  getCart,
};
