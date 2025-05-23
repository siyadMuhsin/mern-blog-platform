import { ObjectId } from "mongoose";
import { IBlog } from "../interfaces/Imodels";
import { IBlogRepository } from "../interfaces/repository/IBlogRepository";
import Blog from "../models/blog.model";

export class BlogRepository implements IBlogRepository {
  async create(data: Partial<IBlog>): Promise<IBlog> {
    const blog = new Blog(data);
    return await blog.save();
  }
  async find(query: { userId?: string } = {}, page: number = 1, limit: number = 10): Promise<{
    blogs: IBlog[];
    total: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const filter = query.userId ? { userId: query.userId } : {};

      const [blogs, total] = await Promise.all([
        Blog.find(filter)
          .populate("userId", "username email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),

        Blog.countDocuments(filter),
      ]);

      return { blogs, total };
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message || "Error in BlogRepository find");
    }
  }
  async findById(id: string): Promise<IBlog | null> {
    return await Blog.findById(id).populate("userId", "username email");
  }
  async update(id: string, data: Partial<IBlog>): Promise<IBlog | null> {
    return await Blog.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id: string): Promise<IBlog | null> {
    return await Blog.findByIdAndDelete(id);
  }
}
