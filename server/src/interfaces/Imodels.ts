import mongoose, { Document } from "mongoose";
import { string } from "zod";

export interface IUser extends Document {
    _id:string;
    username:string;
    email:string;
    password:string;
    createdAt:Date;
    updatedAt:Date;
}

export interface IBlog extends Document{
    title:string,
    content:string,
    imageUrl:string,
    createdAt:Date,
    isPublished:boolean
    userId:{_id:string,username:string,email:string}|string|mongoose.Types.ObjectId
}