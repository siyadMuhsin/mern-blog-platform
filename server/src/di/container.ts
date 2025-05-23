import { Container } from "inversify";
import { TYPES } from "./types";

import { IAuthController } from "../interfaces/controller/IAuthController";
import { AuthController } from "../controllers/auth.controller";
import { IAuthServices } from "../interfaces/services/IAuthServices";
import { AuthService } from "../services/auth.service";
import { IUserRepository } from "../interfaces/repository/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IAuthMiddleware } from "../interfaces/IMiddlerwares";
import { AuthMiddleware } from "../middlewares/authmiddleware";
import { ITokenController } from "../interfaces/controller/ITokenController";
import { TokenController } from "../controllers/token.controller";
import { IBlogController } from "../interfaces/controller/IBlogController";
import { BlogController } from "../controllers/blog.controller";
import { IBlogServices } from "../interfaces/services/IBlogServices";
import { BlogService } from "../services/blog.service";
import { IBlogRepository } from "../interfaces/repository/IBlogRepository";
import { BlogRepository } from "../repositories/BlogRepository";
const container = new Container()
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container.bind<IAuthServices>(TYPES.AuthService).to(AuthService)
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)
container.bind<IAuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware)
container.bind<ITokenController>(TYPES.TokenController).to(TokenController)

//Blogs
container.bind<IBlogController>(TYPES.BlogController).to(BlogController)
container.bind<IBlogServices>(TYPES.BlogService).to(BlogService)
container.bind<IBlogRepository>(TYPES.BlogRepository).to(BlogRepository)
export default container