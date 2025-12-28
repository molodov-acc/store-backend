import { service } from "./cart.service";
import { Request, Response } from "express";

const getCart = async (req: Request, res: Response) => {
  const cart = await service.getCart(req.user.id);
  res.json(cart);
};

const addToCart = async (req: Request, res: Response) => {
  const cart = await service.addToCart({
    userId: req?.user?.id,
    product: req.body,
  });
  res.json(cart);
};

const removeFromCart = async (req: Request, res: Response) => {
  const cart = await service.removeFromCart({
    userId: req?.user?.id,
    productId: req.params.productId,
  });
  res.json(cart);
};

const clearCart = async (req: Request, res: Response) => {
  const cart = await service.clearCart(req?.user?.id);
  res.json(cart);
};

export const controller = {
  clearCart,
  removeFromCart,
  getCart,
  addToCart,
};
