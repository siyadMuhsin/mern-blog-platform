import { IBlog } from "../Imodels";

export interface IBlogRepository{
    create(data:Partial<IBlog>):Promise<IBlog>
    find(query:{userId?:string}|{},page:number,limit:number):Promise<{blogs:IBlog[],total:number}>
    findById(id:string):Promise<IBlog|null>
    update(id:string,data:Partial<IBlog>):Promise<IBlog|null>
    delete(id:string):Promise<IBlog|null>

}