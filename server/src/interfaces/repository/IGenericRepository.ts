// src/interfaces/repository/IGenericRepository.ts
import { FilterQuery } from "mongoose";

export interface IGenericRepository<T> {
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  findOne(query: Partial<T>): Promise<T | null>;
  findAll(filter?: FilterQuery<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}
