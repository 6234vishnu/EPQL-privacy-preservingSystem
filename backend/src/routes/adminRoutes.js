import express from "express";
const adminRouter = express.Router();
import {
  Locationupload,
  Getuserprofile,
  getAdminPlaces,
  updatePlace,
  getAdminDetails,
  logoutAdmin,
} from "../controllers/admin/activitiesController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

adminRouter.post("/add/location", verifyToken, Locationupload);
adminRouter.get("/profile", verifyToken, Getuserprofile);
adminRouter.get("/getlocations", verifyToken, getAdminPlaces);
adminRouter.put("/updateLocation", verifyToken, updatePlace);
adminRouter.post("/authenticateAdmin", verifyToken, getAdminDetails);
adminRouter.post("/logout", verifyToken, logoutAdmin);

export default adminRouter;
