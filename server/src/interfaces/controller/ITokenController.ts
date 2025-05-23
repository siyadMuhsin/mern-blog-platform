import {Request, Response } from "express";

export interface ITokenController{
    refreshToken(req:Request,res:Response):Promise<void>
}