import container from '../di/container'
import { TYPES } from '../di/types'
import { IAuthController } from '../interfaces/controller/IAuthController'
import express from 'express'
import { validate } from '../middlewares/validate'
import { loginSchema, userSchema } from '../validator/user.validator'
import { IAuthMiddleware } from '../interfaces/IMiddlerwares'
import { ITokenController } from '../interfaces/controller/ITokenController'

const router=express.Router()
const authController =container.get<IAuthController>(TYPES.AuthController)
const tokenController=container.get<ITokenController>(TYPES.TokenController)
const authmiddleware= container.get<IAuthMiddleware>(TYPES.AuthMiddleware)
router.post('/signup',validate(userSchema),authController.signup.bind(authController))
router.post('/login',validate(loginSchema),authController.login.bind(authController))
router.post('/logout',authController.logout.bind(authController))
router.post('/refresh',tokenController.refreshToken.bind(tokenController))
router.get('/me',authmiddleware.verifyToken.bind(authmiddleware),authController.getCorrentUser.bind(authController))
function test(){
    console.log("working")
}
export default router