import { IUser } from "../Imodels";

export interface IAuthServices {
    signup(username: string, email: string, password: string): Promise<{ok:boolean,message:string}>;
    login(email:string,password:string):Promise<{ok:boolean,message:string,accessToken?:string,refreshToken?:string,user?:IUser}>
    getUser(userId:string):Promise<{ok:boolean,msg:string,user?:Partial<IUser>}>
}