import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: String,
  type: String,
  address: String,
  contact: String,
  encryptedCoords: {
    lat: String,
    lng: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  }
});

placeSchema.index({ location: '2dsphere' }); // required for $nearSphere

export default mongoose.model('Places', placeSchema);



