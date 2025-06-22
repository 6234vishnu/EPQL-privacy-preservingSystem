import express from 'express'
import { findAddress } from '../controllers/user/activitiesController.js'
import { userSignUp,Loginuser,Getuserprofilepicture, } from '../controllers/user/authController.js'
const userRouter=express.Router()

userRouter.post("/find-address",findAddress)
userRouter.post("/userSignUp",userSignUp)
userRouter.post("/login",Loginuser)
userRouter.get("/profile",Getuserprofilepicture)


export default userRouter