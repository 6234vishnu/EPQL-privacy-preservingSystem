import express from 'express'
const adminRouter=express.Router()
import { Locationupload } from '../controllers/admin/activitiesController.js'


adminRouter.post("/location/add",Locationupload)

export default adminRouter