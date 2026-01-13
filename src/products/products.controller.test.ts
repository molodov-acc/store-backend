import { Request, Response } from "express";
import { controller } from "./products.controller";
import { service } from "./products.service";

jest.mock("./products.service");

describe("ProductsController", () => {
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();

    res = {
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("getAll", () => {
    it("Должен вернуть список продуктов", async () => {
      const query = { limit: "10" };
      const products = [{ id: "1", name: "Product" }];

      (service.getAll as jest.Mock).mockResolvedValue(products);

      const req = {
        query,
      } as unknown as Request;

      await controller.getAll(req, res);

      expect(service.getAll).toHaveBeenCalledWith(query);
      expect(res.json).toHaveBeenCalledWith(products);
    });
  });

  describe("getById", () => {
    it("Должен вернуть продукт по id", async () => {
      const product = { id: "1", name: "Product" };

      (service.getById as jest.Mock).mockResolvedValue(product);

      const req = {
        params: { id: "1" },
      } as unknown as Request;

      await controller.getById(req, res);

      expect(service.getById).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it("Должен отловить ошибку если сервис не нашёл продукт", async () => {
      (service.getById as jest.Mock).mockResolvedValue(null);

      const req = {
        params: { id: "404" },
      } as unknown as Request;

      await expect(controller.getById(req, res)).rejects.toMatchObject({
        message: "Product not found",
        statusCode: 404,
      });

      expect(service.getById).toHaveBeenCalledWith("404");
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
