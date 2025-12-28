import { service } from "./cart.service";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

const getCart = (req: AuthRequest, res: Response) => {
  const cart = service.getCart(req.user.id);
  res.json(cart);
};

const addToCart = (req: AuthRequest, res: Response) => {
  const cart = service.addToCart({ userId: req?.user?.id, product: req.body });
  res.json(cart);
};

const removeFromCart = (req: AuthRequest, res: Response) => {
  const cart = service.removeFromCart({
    userId: req?.user?.id,
    productId: req.params.productId,
  });
  res.json(cart);
};

const clearCart = (req: AuthRequest, res: Response) => {
  const cart = service.clearCart(req?.user?.id);
  res.json(cart);
};

export const controller = {
  clearCart,
  removeFromCart,
  getCart,
  addToCart,
};
