import React, { useState } from "react";
import api from "../../services/axiosInstance";
import "../../assets/css/user/NearbySearch.css";
import ErrorModal from "./errorModal";

function LocationQuery() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roundedLat = Math.round(parseFloat(latitude) * 100) / 100;
    const roundedLng = Math.round(parseFloat(longitude) * 100) / 100;

    try {
      const res = await api.post("/api/user/find-address", {
        latitude: roundedLat,
        longitude: roundedLng,
        type: placeType.trim(),
      });
      if (res.data.success) {
        return setResults(res.data);
      }
      setErrorMessage(res.data.message);
      return setErrorModal(true);
    } catch (error) {
      console.error("Error querying address", error);
      setErrorMessage(error?.res?.data?.message||"server error try later");
      return setErrorModal(true);
    }
  };

  return (
    <>
    <div className="nearbySearchContainer">
      <h2 className="nearbySearchTitle">
        Find Nearby Places (Privacy Preserved)
      </h2>
      <form className="nearbySearchForm" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for (e.g. Hospital, Police Station)"
          value={placeType}
          onChange={(e) => setPlaceType(e.target.value)}
          className="nearbySearchInput"
          required
        />
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
        {results.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No places found.
          </p>
        ) : (
          results.map((place) => (
            <li key={place._id} className="nearbySearchItem">
              <strong>{place.name}</strong> - {place.address} ({place.type})
            </li>
          ))
        )}
      </ul>
    </div>
    {errorModal&&(
        <ErrorModal
        message={errorMessage}
        onClose={()=>setErrorModal(false)}
        />
    )}
    </>
  );
}

export default LocationQuery;
