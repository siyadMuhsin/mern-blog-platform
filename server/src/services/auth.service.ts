import { inject, injectable } from "inversify";
import { IAuthServices } from "../interfaces/services/IAuthServices";
import { IUserRepository } from "../interfaces/repository/IUserRepository";
import bcrypt from "bcryptjs";
import { TYPES } from "../di/types";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/Imodels";

@injectable()
export class AuthService implements IAuthServices {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository
  ) {}

  async signup(username: string, email: string, password: string): Promise<{ ok: boolean; message: string }> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      return { ok: false, message: "User already exists" };
    }
    const existingUsername = await this._userRepository.findOne({ username });
    if (existingUsername) {
      return { ok: false, message: "Username already exists" };
    }
    const hashedPassword = await this.hashPassword(password);
    await this._userRepository.create({ username, email, password: hashedPassword });
    return { ok: true, message: "User signed up successfully" };
  }

  async login(email: string, password: string): Promise<{ ok: boolean; message: string ,accessToken?:string,refreshToken?:string,user?:IUser}> {
    try {
      const existingUser = await this._userRepository.findByEmail(email);
      if (!existingUser) {
        return { ok: false, message: "Invalid email or password" };
      }
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return { ok: false, message: "Invalid email or password" };
      }
      return { 
        ok: true,
         message: "User login successfully",
         accessToken:this.generateAccessToken(existingUser._id),
         refreshToken:this.generateRefreshToken(existingUser._id),
         user:existingUser
        };
    } catch (error) {
      console.error("Error during login:", error);
      return { ok: false, message: "Login failed" };
    }
  }
 async getUser(userId:string):Promise<{ok:boolean,msg:string,user?:Partial<IUser>}>{
    try {
      const user= await this._userRepository.findById(userId)
      if(user){
        const manipulateUser:Partial<IUser>={}
        manipulateUser.username=user.username
        manipulateUser.email=user.email
        return {ok:true,msg:"user fetching success",user:manipulateUser}
      }
      throw new Error("User not found")
    } catch (error) {
      const err=error as Error
      throw new Error(err.message)
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
   private generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
  }
}
