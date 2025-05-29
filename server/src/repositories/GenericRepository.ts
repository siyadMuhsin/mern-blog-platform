// src/repositories/GenericRepository.ts
import { Model, FilterQuery } from "mongoose";
import { IGenericRepository } from "../interfaces/repository/IGenericRepository";

export class GenericRepository<T> implements IGenericRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error((error as Error).message || "Unable to find by ID");
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const created = new this.model(data);
      return (await created.save()).toObject();
    } catch (error) {
      throw new Error((error as Error).message || "Unable to create");
    }
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findOne(query as FilterQuery<T>);
    } catch (error) {
      throw new Error((error as Error).message || "Unable to find one");
    }
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter);
    } catch (error) {
      throw new Error((error as Error).message || "Unable to find all");
    }
  }
    async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
