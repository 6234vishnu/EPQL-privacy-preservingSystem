import express from "express";
const adminRouter = express.Router();
import {
  Locationupload,
  Getuserprofile,
} from "../controllers/admin/activitiesController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

adminRouter.post("/add/location", Locationupload);
adminRouter.get("/profile", verifyToken, Getuserprofile);

export default adminRouter;
