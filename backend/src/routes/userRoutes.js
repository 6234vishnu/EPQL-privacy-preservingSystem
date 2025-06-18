import express from 'express'
import { findAddress } from '../controllers/user/activitiesController.js'
const userRouter=express.Router()

userRouter.post("/find-address",findAddress)


export default userRouter