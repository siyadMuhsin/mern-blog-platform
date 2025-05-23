import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authmiddleware';
export interface IAuthController {
    signup(req:Request, res:Response):Promise<void>;
    login(req:Request, res:Response):Promise<void>;
    logout(req:AuthRequest,res:Response):Promise<void>
    getCorrentUser(req:AuthRequest,res:Response):Promise<void>
}
