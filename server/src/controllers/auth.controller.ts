import { IAuthController } from "../interfaces/controller/IAuthController";
import { IAuthServices } from "../interfaces/services/IAuthServices";
import { Request, Response } from "express";
import { HttpStatus } from "../types/httpStatus";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { AuthRequest } from "../middlewares/authmiddleware";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private _authService: IAuthServices
  ) {}
  async signup(req: Request, res: Response): Promise<void> {
    const { email, password,username } = req.body;
    if (!email || !password || !username) {
      this.sendResponse(res, { message: "All fields are required" }, HttpStatus.BAD_REQUEST);
      return;
    }
    for (let key in req.body) {
      if (typeof req.body[key] === 'string' && !req.body[key].trim()) {
       this.sendResponse(res, { message: `${key} is required` }, HttpStatus.BAD_REQUEST);
      return;
     }
    }
  // Check email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!emailRegex.test(email)){
        this.sendResponse(res,{ok:false,message:"Invalid email format"},HttpStatus.BAD_REQUEST)
        return
    }
    if(password.length<6){
        this.sendResponse(res,{ok:false,message:"Password must be at least 6 characters long"},HttpStatus.NOT_FOUND)
        return
    }
    // Uppercase-only password validation
const passwordRegex = /^(?=.*[A-Z]).{6,}$/
if (!passwordRegex.test(password)) {
  this.sendResponse(res, { message: "Password must be include at least one uppercase letter."}, HttpStatus.BAD_REQUEST);
  return;
}
    try {
      const result = await this._authService.signup(username, email, password);
      this.sendResponse(res,result,result.ok? HttpStatus.CREATED:HttpStatus.BAD_REQUEST);
    } catch (error) {
        const err=error as Error
      this.sendResponse(res, { message: err.message }, HttpStatus.SERVER_ERROR);
    }
  }

  async login(req:Request,res:Response):Promise<void>{
    try {
        const { email, password } = req.body;
       for (let key in req.body) {
     if (typeof req.body[key] === 'string' && !req.body[key].trim()) {
       this.sendResponse(res, { message: `${key} is required` }, HttpStatus.BAD_REQUEST);
       return;
     }
    }
   // Check email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!emailRegex.test(email)){
        this.sendResponse(res,{ok:false,message:"Invalid email format"},HttpStatus.BAD_REQUEST)
        return
    }

    const result= await this._authService.login(email,password)
    if(result.ok && result.accessToken && result.refreshToken ){
        this.setAuthCookies(res,result.accessToken,result.refreshToken)
        this.sendResponse(res,{ok:true,message:result.message,user:result.user},HttpStatus.OK)
        return
    }
    this.sendResponse(res,{message:result.message},HttpStatus.BAD_REQUEST)
    } catch (error) {
        const err= error as Error
        this.sendResponse(res,{message:err.message},HttpStatus.SERVER_ERROR)
    }
  }

  async logout (req:AuthRequest,res:Response):Promise<void>{
    try {
      const user= req?.user
      
        res.clearCookie('accessToken',{
          httpOnly:true,
          sameSite:"none",
          secure:true
        })
        res.clearCookie('refreshToken',{
          httpOnly:true,
          secure:true,
          sameSite:"none"
        })
      
        
        this.sendResponse(res,{ok:true,msg:'Log out user successfully'},HttpStatus.OK)
      
    } catch (error) {
      const err= error as Error
      this.sendResponse(res,{msg:err.message||"Internal server error"},HttpStatus.SERVER_ERROR)
    }

  }
  async getCorrentUser(req:AuthRequest,res:Response):Promise<void>{
    try {
      const userId=req.user as string
      // return
      const result=await this._authService.getUser(userId)
      this.sendResponse(res,result,HttpStatus.OK)
    } catch (error) {
      const err=error as Error
      this.sendResponse(res,{msg:err.message},HttpStatus.SERVER_ERROR)
      
    }
  }

  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
  private setAuthCookies(res:Response,accessToken:string,refreshToken:string):void{
   const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const ,
    };
   res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

     res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
}
