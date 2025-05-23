import express from 'express'
import container from '../di/container'
import { IBlogController } from '../interfaces/controller/IBlogController'
import { TYPES } from '../di/types'
import { IAuthController } from '../interfaces/controller/IAuthController'
import { IAuthMiddleware } from '../interfaces/IMiddlerwares'
import upload from '../config/multer'
const blogRouter=express.Router()
const blogController=container.get<IBlogController>(TYPES.BlogController)
const authController=container.get<IAuthController>(TYPES.AuthController)
const authmiddleware=container.get<IAuthMiddleware>(TYPES.AuthMiddleware)
blogRouter.post('/',upload.single("image"),authmiddleware.verifyToken.bind(authmiddleware),blogController.createBlog.bind(blogController))
blogRouter.get('/',blogController.getAllBlogs.bind(blogController))
blogRouter.get('/user',authmiddleware.verifyToken.bind(authmiddleware),blogController.getUserBlogs.bind(blogController))
blogRouter.get('/:blogId',blogController.getBlogDetails.bind(blogController))
blogRouter.put('/:blogId',authmiddleware.verifyToken.bind(authmiddleware),upload.single("image"),blogController.updateBlog.bind(blogController))
blogRouter.delete('/:blogId',authmiddleware.verifyToken.bind(authmiddleware),blogController.deleteBlog.bind(blogController))
function test(){
    console.log("working")
}
export default blogRouter