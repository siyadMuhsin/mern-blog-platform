import { BlogController } from "../controllers/blog.controller";
import { BlogRepository } from "../repositories/BlogRepository";


export const TYPES={
    AuthController:Symbol.for("AuthController"),
    AuthService:Symbol.for('AuthService'),
    UserRepository:Symbol.for('UserRepository'),
    AuthMiddleware:Symbol.for('AuthMiddleware'),
    TokenController:Symbol.for('TokenController'),

    //Blog
    BlogRepository:Symbol.for('BlogRepository'),
    BlogController:Symbol.for('BlogController'),
    BlogService:Symbol.for('BlogService')

}