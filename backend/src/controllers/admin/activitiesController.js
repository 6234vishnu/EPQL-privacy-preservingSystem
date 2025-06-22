import { encrypt } from "../../utils/encryptUtils.js";
import  Place  from "../../models/placeShema.js";

export const Locationupload = async (req, res) => {
  console.log(req.url);
  console.log(req.body);

  const { name, address, latitude, longitude, type } = req.body;

  
  const latNum = parseFloat(latitude);
  const lngNum = parseFloat(longitude);


  if (
    isNaN(latNum) || isNaN(lngNum) ||
    latNum < -90 || latNum > 90 ||
    lngNum < -180 || lngNum > 180
  ) {
    return res.status(400).json({success:false, message: "Invalid latitude or longitude" });
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

    await newPlace.save();
    res.status(200).json({success:true, message: "Location saved successfully" });
  } catch (error) {
    console.error("Error saving location:", error);
   return res.status(500).json({ message: "Server error" });
  }
};