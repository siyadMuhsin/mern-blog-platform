import { Response,Request } from "express";
import { AuthRequest } from "../../middlewares/authmiddleware";

export interface IBlogController{
    getAllBlogs(req:Request,res:Response):Promise<void>
    createBlog(req:AuthRequest,res:Response):Promise<void>
    getBlogDetails(req:Request,res:Response):Promise<void>
    getUserBlogs(req:AuthRequest,res:Response):Promise<void>
    updateBlog(req:AuthRequest,res:Response):Promise<void>
    deleteBlog(req:AuthRequest,res:Response):Promise<void>
    
}