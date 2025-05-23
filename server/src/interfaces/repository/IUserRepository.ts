import { IUser } from "../Imodels";

export interface IUserRepository{
    create(data:Partial<IUser>):Promise<IUser>
    findById(id:string):Promise<IUser|null>
    findByEmail(email:string):Promise<IUser|null>
    findOne(query:Partial<IUser>):Promise<IUser|null>
}
