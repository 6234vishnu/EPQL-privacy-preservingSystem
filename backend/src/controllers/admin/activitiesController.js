import { encrypt } from "../../utils/encryptUtils.js";
import Place from "../../models/placeShema.js";
import { usermodel } from "../../models/userSchema.js";

export const Locationupload = async (req, res) => {
  const { name, address, latitude, longitude, type } = req.body;

  if (!name || !address || !latitude || !longitude || !type)
    return res.status(400).json({
      success: false,
      message: "fill all the feilds before submission",
    });
  const latNum = parseFloat(latitude);
  const lngNum = parseFloat(longitude);

  if (
    isNaN(latNum) ||
    isNaN(lngNum) ||
    latNum < -90 ||
    latNum > 90 ||
    lngNum < -180 ||
    lngNum > 180
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid latitude or longitude" });
  }

  try {
    // Encrypt coordinates as strings
    const encryptedLat = encrypt(latNum.toString());
    const encryptedLng = encrypt(lngNum.toString());

    const newPlace = new Place({
      name,
      type,
      address,
      encryptedCoords: {
        lat: encryptedLat,
        lng: encryptedLng,
      },
      location: {
        type: "Point",
        coordinates: [lngNum, latNum], // GeoJSON format: [longitude, latitude]
      },
    });

    const savePlace = await newPlace.save();
    if (!savePlace)
      return res.status(500).json({ success: false, message: "server error" });
    res
      .status(200)
      .json({ success: true, message: "Location saved successfully" });
  } catch (error) {
    console.error("Error saving location:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const Getuserprofile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await usermodel.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, user: user });
  } catch (err) {
    console.error("Error fetching profile", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAdminPlaces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [places, total] = await Promise.all([
      Place.find().skip(skip).limit(limit),
      Place.countDocuments(),
    ]);
    if (!places || !total)
      return res.status(500).json({
        success: false,
        message: "server error try later",
        places,
        total,
      });

    return res.status(200).json({
      success: true,
      places,
      total,
    });
  } catch (error) {
    console.error("Error fetching places:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error. Failed to fetch places.",
    });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const placeId = req.query.placeId;
    const { updateData } = req.body;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        message: "Place ID is required",
      });
    }

    const updatedPlace = await Place.findByIdAndUpdate(placeId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlace) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Place updated successfully",
      updatedPlace,
    });
  } catch (error) {
    console.error("Error updating place:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Failed to update place.",
    });
  }
};

export const getAdminDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const findAdmin = await usermodel.findById(id);
    if (!findAdmin) {
      return res
        .status(500)
        .json({ success: false, message: "coudint find admin please login" });
    }

    return res
      .status(200)
      .json({ success: true, message: "successFully identified admin" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: " Couldint Logged out try later" });
  }
};
