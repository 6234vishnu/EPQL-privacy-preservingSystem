import Places from '../../models/placeShema.js'
import {decrypt,encrypt} from '../../utils/encryptUtils.js'

export const findAddress = async (req, res) => {
  const { latitude, longitude, type } = req.body;

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Validate coordinates
  if (
    isNaN(lat) || isNaN(lng) ||
    lat < -90 || lat > 90 ||
    lng < -180 || lng > 180
  ) {
    return res.status(400).json({ success: false, message: 'Invalid coordinates provided' });
  }

  const query = {
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat], // MongoDB expects [longitude, latitude]
        },
        $maxDistance: 5000, // 5km radius
      },
    },
  };

  if (type) {
    query.type = { $regex: new RegExp(type, 'i') };
  }

  try {
    const nearbyPlaces = await Places.find(query);

    const results = nearbyPlaces.map(place => ({
      ...place._doc,
      decryptedCoords: {
        lat: decrypt(place.encryptedCoords.lat),
        lng: decrypt(place.encryptedCoords.lng)
      }
    }));

    return res.status(200).json({ success: true, nearbyPlaces: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
