import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { AppError } from "../errors/AppError";
import { storage } from "./auth.storage";
import { AuthCredentials, User } from "./types";

const register = async ({ email, password }: AuthCredentials) => {
  if (!email?.trim() || !password?.trim()) {
    throw new AppError("Email and password required", 400);
  }

  const existingUser = await storage.findByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: randomUUID(),
    email,
    password: hashedPassword,
  };

  await storage.create(user);

  return generateToken(user);
};

const login = async ({ email, password }: AuthCredentials) => {
  if (!email?.trim() || !password?.trim()) {
    throw new AppError("Email and password required", 400);
  }

  const user = await storage.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  return generateToken(user);
};

function generateToken(user: User) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export const service = {
  login,
  register,
};
