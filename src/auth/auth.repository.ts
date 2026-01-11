import { AppError } from "../errors/AppError";
import { prisma } from "../prisma";

export class UserRepository {
  static async create(data: { email: string; password: string }) {
    try {
      const user = await prisma.user.create({ data });

      return user;
    } catch (e) {
      throw new AppError("Ошибка", 500);
    }
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}
