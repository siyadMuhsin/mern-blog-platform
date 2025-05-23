import { Request,Response } from "express";
import { HttpStatus } from "../types/httpStatus";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { ITokenController } from "../interfaces/controller/ITokenController";
dotenv.config()
export class TokenController implements ITokenController{
    private _refreshTokenSecret:string;
    constructor(){
        this._refreshTokenSecret=process.env.REFRESH_TOKEN_SECRET as string
    }
    async refreshToken(req:Request,res:Response):Promise<void>{
try {
    const oldToken=req.cookies.refreshToken;
    if(!oldToken){
        this.sendResponse(res,{ok:false,msg:"Unauthorized: No refresh token"},HttpStatus.BAD_REQUEST)
    return
    }
    
    const decode=await this.tokenVerify(oldToken,this._refreshTokenSecret)
    if(!decode){
        this.sendResponse(res,{ok:false,msg:" Invalid token payload"},HttpStatus.BAD_REQUEST)
    }
    const newAccessToken=this.generateAccessToken(decode.userId)
    const newRefreshToken=this.generateRefreshToken(decode.userId)
    this.setAccessTokenCookie(res,newAccessToken)
    this.setRefreshTokenCookie(res,newRefreshToken)
    this.sendResponse(res,{ok:true},HttpStatus.OK)
}catch(error){
    console.error("Error from refreshing Token",error)
    const err= error as Error
    this.sendResponse(res,{msg:err.message||"Invalid refresh token"},HttpStatus.FORBIDDEN)

}
 

}
private sendResponse(res:Response,data:any,status:HttpStatus):void{
    res.status(status).json(data)
}
private tokenVerify(token:string,secret:string):Promise<any>{
    return new Promise((resolve,reject)=>{
    jwt.verify(token,secret,(err,decode)=>{
        if(err) return reject(err)
        resolve (decode)    
    })
        
    })
}
  private setAccessTokenCookie(res: Response, token: string): void {
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
    }
    private setRefreshTokenCookie(res: Response, token: string): void {
        res.cookie("refreshToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
       private generateAccessToken(userId: string): string {
        return jwt.sign({userId} , process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
      }
    
      private generateRefreshToken(userId: string): string {
        return jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
      }
}