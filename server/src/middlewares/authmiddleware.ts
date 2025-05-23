import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HttpStatus } from "../types/httpStatus";
import { IAuthMiddleware } from "../interfaces/IMiddlerwares";

export interface AuthRequest extends Request {
  user?: any;
}

export class AuthMiddleware implements IAuthMiddleware {
  private _accessTokenSecret: string;

  constructor() {
    this._accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  }

  async verifyToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = this.getTokenFromRequest(req);

      if (!token) {
        this.sendResponse(res, { msg: "Unauthorized: No token provided" }, HttpStatus.UNAUTHORIZED);
        return;
      } 
      const decoded = await this.tokenVerify(token, this._accessTokenSecret);

      req.user = decoded.userId;
      next();

    } catch (error: any) {
      console.error("Token verification error:", error);
      if (error.name === "TokenExpiredError") {
        this.sendResponse(res, { msg: "Token expired" }, HttpStatus.UNAUTHORIZED);
      } else {
        this.sendResponse(res, { msg: "Invalid token" }, HttpStatus.UNAUTHORIZED);
      }
    }
  }

  private getTokenFromRequest(req: Request): string | null {
    return req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1] || null;
  }

  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }

  private tokenVerify(token: string, secret: string): Promise<JwtPayload > {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded as JwtPayload);
      });
    });
  }
}