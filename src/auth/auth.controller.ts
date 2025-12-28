import { service } from "./auth.service";
import { Request, Response } from "express";

interface AuthBody {
  email: string;
  password: string;
}

export const register = async (
  req: Request<{}, {}, AuthBody>,
  res: Response
) => {
  const token = await service.register(req.body);
  res.json({ token });
};

export const login = async (req: Request<{}, {}, AuthBody>, res: Response) => {
  const token = await service.login(req.body);
  res.json({ token });
};
