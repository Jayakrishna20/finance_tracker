import { PrismaClient } from "@prisma/client/extension";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema.js";

export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  async createCategory(data: CreateCategoryInput) {
    return this.prisma.categories.create({
      data,
    });
  }

  async getAllCategories() {
    return this.prisma.categories.findMany({
      select: {
        categoryId: true,
        categoryName: true,
        categoryColorCode: true,
        categoryType: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getCategoriesByType(categoryTypeId: bigint) {
    return this.prisma.categories.findMany({
      select: {
        categoryId: true,
        categoryName: true,
        categoryColorCode: true,
      },
      where: { categoryType: categoryTypeId },
      orderBy: { categoryName: "asc" },
    });
  }

  async getCategoryById(categoryId: bigint) {
    return this.prisma.categories.findUnique({
      select: {
        categoryId: true,
        categoryName: true,
        categoryColorCode: true,
        categoryType: true,
      },
      where: { categoryId },
    });
  }

  async updateCategory(categoryId: bigint, data: UpdateCategoryInput) {
    return this.prisma.categories.update({
      where: { categoryId },
      data,
    });
  }

  async deleteCategory(categoryId: bigint) {
    return this.prisma.categories.delete({
      where: { categoryId },
    });
  }
}
