import { Request, Response } from "express";
import { IBlogController } from "../interfaces/controller/IBlogController";
import { AuthRequest } from "../middlewares/authmiddleware";
import { HttpStatus } from "../types/httpStatus";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IBlogServices } from "../interfaces/services/IBlogServices";
import mongoose, { Types } from "mongoose";

@injectable()
export class BlogController implements IBlogController {
  constructor(@inject(TYPES.BlogService) private _blogService: IBlogServices) {}
  async createBlog(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user as string;

      if (!userId) {
        return this.sendResponse(
          res,
          { ok: false, msg: "Unauthorized" },
          HttpStatus.UNAUTHORIZED
        );
      }

      const { title, content } = req.body;

      if (!title?.trim() || !content?.trim()) {
        return this.sendResponse(
          res,
          { ok: false, msg: "Title and content are required" },
          HttpStatus.BAD_REQUEST
        );
      }

      if (content.trim().split(/\s+/).length < 50) {
        return this.sendResponse(
          res,
          { ok: false, msg: "Content must be at least 50 words" },
          HttpStatus.BAD_REQUEST
        );
      }

      if (!req.file) {
        return this.sendResponse(
          res,
          { ok: false, msg: "Image is required" },
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this._blogService.createBlogs(
        userId,
        { title: title.trim(), content: content.trim() },
        req.file
      );
      this.sendResponse(res, result, HttpStatus.CREATED);
    } catch (error) {
      const err = error as Error;
      console.error("Blog creation failed:", err.message);
      this.sendResponse(
        res,
        { ok: false, msg: err.message || "Internal Server Error" },
        HttpStatus.SERVER_ERROR
      );
    }
  }
  async getAllBlogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page = "1", limit = "10" } = req.query;
      const userId=req.user as string
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      if (isNaN(pageNum) || pageNum < 1) {
        this.sendResponse(
          res,
          { ok: false, msg: "Invalid page number" },
          HttpStatus.BAD_REQUEST
        );
        return;
      }
      if (isNaN(limitNum) || limitNum < 1) {
        this.sendResponse(
          res,
          { ok: false, msg: "Invalid limit" },
          HttpStatus.BAD_REQUEST
        );
        return;
      }

      const result = await this._blogService.getAllBlogs(pageNum, limitNum, userId as string | undefined,true);

      this.sendResponse(res, { ok: true, data: result }, HttpStatus.OK);
    } catch (error) {
      const err = error as Error;
      this.sendResponse(
        res,
        { ok: false, msg: err.message },
        HttpStatus.SERVER_ERROR
      );
    }
  }
  async getBlogDetails(req: Request, res: Response): Promise<void> {
    try {
      const { blogId } = req.params;

      if (!blogId || !Types.ObjectId.isValid(blogId)) {
        this.sendResponse(res, { msg: "Blog id is required" }, HttpStatus.OK);
      }
      const result = await this._blogService.getBlog(blogId);
      this.sendResponse(res, result, HttpStatus.OK);
    } catch (error) {
      const err = error as Error;
      this.sendResponse(res, { msg: err.message }, HttpStatus.SERVER_ERROR);
    }
  }

  async getUserBlogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user as string;
      const { page = "1", limit = "10" } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result = await this._blogService.getAllBlogs(pageNum,limitNum,userId,true);

      this.sendResponse(res, result, HttpStatus.OK);
    } catch (error) {
      const err = error as Error;
      this.sendResponse(
        res,
        { ok: false, msg: err.message },
        HttpStatus.SERVER_ERROR
      );
    }
  }
  async updateBlog(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user as string;
      const { blogId } = req.params;
      const { title, content } = req.body;

      if (!blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
        return this.sendResponse(
          res,
          { ok: false, msg: "Valid blog ID is required" },
          HttpStatus.BAD_REQUEST
        );
      }

      if (!title?.trim() || !content?.trim()) {
        return this.sendResponse(
          res,
          { ok: false, msg: "Title and content are required" },
          HttpStatus.BAD_REQUEST
        );
      }

      if (content.trim().split(/\s+/).length < 50) {
        return this.sendResponse(
          res,
          { ok: false, msg: "Content must be at least 50 words" },
          HttpStatus.BAD_REQUEST
        );
      }
  

      const result = await this._blogService.updateBlog(
        { title, content },
        blogId,
        userId,
        req.file
      );

      this.sendResponse(res, result, HttpStatus.OK); // 200 OK is more appropriate for updates
    } catch (error) {
      const err = error as Error;
      this.sendResponse(
        res,
        { ok: false, msg: err.message },
        HttpStatus.SERVER_ERROR
      );
    }
  }
async deleteBlog(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user as string;
    const { blogId } = req.params;

    if (!blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
      return this.sendResponse(
        res,
        { ok: false, msg: "Valid blog ID is required" },
        HttpStatus.BAD_REQUEST
      );
    }

    const result = await this._blogService.deleteBlog(blogId, userId);

    return this.sendResponse(res, result, HttpStatus.OK);
  } catch (error: any) {
    console.error("Delete Blog Error:", error);
    return this.sendResponse(
      res,
      { ok: false, msg: error.message || "Something went wrong" },
      HttpStatus.SERVER_ERROR
    );
  }
}

async draftedBlogs(req:AuthRequest,res:Response):Promise<void>{
  try {
    const userId = req.user as string;
      const { page = "1", limit = "10" } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const result=await this._blogService.getAllBlogs(pageNum,limitNum,userId,false)
 
      this.sendResponse(res,result,HttpStatus.OK)
  } catch (error) {
    const err= error as Error
    this.sendResponse(res,{msg:err.message},HttpStatus.SERVER_ERROR)
  }
}

async publishBlog(req:AuthRequest,res:Response):Promise<void>{
  try {
    const userId=req.user as string
    const {blogId}= req.params
    if(!mongoose.Types.ObjectId.isValid(blogId)){
      this.sendResponse(res,{ok:false,msg:"Blog Id is required"},HttpStatus.BAD_REQUEST)
      return
    }
    const result=await this._blogService.blogPublish(userId,blogId)
    this.sendResponse(res,result,HttpStatus.OK)
  } catch (error) {
    const err=error as Error
    this.sendResponse(res,{msg:err.message},HttpStatus.SERVER_ERROR)
  }
}
  private sendResponse(res: Response, data: any, status: HttpStatus) {
    res.status(status).json(data);
  }
}
