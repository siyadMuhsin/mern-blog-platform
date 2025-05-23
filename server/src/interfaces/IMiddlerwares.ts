import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authmiddleware";

export interface IAuthMiddleware{
    verifyToken(req:AuthRequest,res:Response,next:NextFunction):Promise<void>
}