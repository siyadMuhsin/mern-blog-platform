import { IBlog } from "../Imodels";
import { IGenericRepository } from "./IGenericRepository";

export interface IBlogRepository extends IGenericRepository<IBlog>{
    find(query: { isPublished: boolean; userId?: string } | {},page:number,limit:number):Promise<{blogs:IBlog[],total:number}>
    findById(id:string):Promise<IBlog|null>
}