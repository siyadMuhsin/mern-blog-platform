import { FilterQuery } from "mongoose";
import { IUser } from "../interfaces/Imodels";
import { IUserRepository } from "../interfaces/repository/IUserRepository";
import User from "../models/user.model";

export class UserRepository  implements IUserRepository{
    async findById(id:string):Promise<IUser|null>{
        try{
            return await User.findById(id)
        }catch(error){
            const err=error as Error
            console.error("Error finding user by ID:", error);
            throw new Error(err.message || "Unable to find user");
        }
    }
    async create(data:Partial<IUser>):Promise<IUser>{
        try {
            const user= new User(data)
            return await user.save()
        } catch (error) {
            const err=error as Error
            console.error("Error creating user:", error);
      throw new Error(err.message||"Unable to create user");
        }
    }
   async findByEmail(email:string):Promise<IUser|null>{
    try{
        return await User.findOne({email})
    }catch(error){
        const err=error as Error
        console.error("Error finding user by email:", error);
        throw new Error(err.message || "Unable to find user");
    }
   }
   async findOne(query: Partial<IUser>): Promise<IUser | null> {
       try{
        console.log(query);
        return await User.findOne(query as FilterQuery<IUser>)
       }catch(error){
        const err=error as Error
        console.error("Error finding user:", error);
        throw new Error(err.message || "Unable to find user");
       }
   }
} 