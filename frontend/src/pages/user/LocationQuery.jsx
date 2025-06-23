import React, { useState } from "react";
import api from "../../services/axiosInstance";
import "../../assets/css/user/NearbySearch.css";
import ErrorModal from "./ErrorModal"; // Ensure this path and filename casing is correct

function LocationQuery() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResults([]); // Clear previous results
    setErrorModal(false);

    const roundedLat = Math.round(parseFloat(latitude) * 100) / 100;
    const roundedLng = Math.round(parseFloat(longitude) * 100) / 100;

    try {
      const res = await api.post("/api/user/find/address", {
        latitude: roundedLat,
        longitude: roundedLng,
        type: placeType.trim(),
      });

      if (res.data.success && Array.isArray(res.data.nearbyPlaces)) {
        setResults(res.data.nearbyPlaces);
      } else {
        throw new Error(res.data.message || "Unexpected response");
      }
    } catch (error) {
      console.error("Error querying address:", error);
      setErrorMessage(error?.response?.data?.message || error.message || "Server error, try later.");
      setErrorModal(true);
    }
  };

  return (
    <>
      <div className="nearbySearchContainer">
        <h2 className="nearbySearchTitle">Find Nearby Places (Privacy Preserved)</h2>

        <form className="nearbySearchForm" onSubmit={handleSubmit}>
          <select
    name="placeType"
    value={placeType}
    onChange={(e) => setPlaceType(e.target.value)}
    className="nearbySearchInput"
    required
  >
    <option value="">Select Type</option>
    <option value="Hospital">Hospital</option>
    <option value="School">School</option>
    <option value="Police Station">Police Station</option>
    <option value="Fire Station">Fire Station</option>
  </select>
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="nearbySearchInput"
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="nearbySearchInput"
            required
          />
          <button type="submit" className="nearbySearchButton">
            Search
          </button>
        </form>

        <ul className="nearbySearchList">
          {Array.isArray(results) && results.length > 0 ? (
            results.map((place) => (
              <li key={place._id} className="nearbySearchItem">
                Place Name: <strong>{place.name}</strong> | Address: <strong>{place?.address}</strong> | Type: <strong>{place?.type}</strong>| Contact: <strong>{place?.phone}</strong>
              </li>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No {placeType} found near 5km.
            </p>
          )}
        </ul>
      </div>

      {errorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}
    </>
  );
}

export default LocationQuery;
