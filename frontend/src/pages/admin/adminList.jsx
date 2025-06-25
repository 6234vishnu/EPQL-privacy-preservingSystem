import React, { useState, useEffect } from "react";
import {
  Edit,
  MapPin,
  Building,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../../assets/css/admin/adminList.css";
import api from "../../services/axiosInstance";
import ErrorModal from "../user/ErrorModal";

const AdminPlaceList = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatePlaceId, setUpdatePlaceId] = useState();
  const [errorModal, setErrorModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    coordinates: [0, 0],
  });

  useEffect(() => {
    fetchPlaces();
  }, [currentPage]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/api/admin/getlocations?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (response.data.success) {
        setPlaces(response.data.places);
        return setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      }
      setErrorMessage(response.data.message);
      return setErrorModal(true);
    } catch (error) {
      console.error("Error fetching places:", error);
      setErrorMessage(error?.response?.data?.message);
      return setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setUpdatePlaceId(place._id);
    setFormData({
      name: place.name,
      type: place.type,
      address: place.address,
      coordinates: place.location.coordinates,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlace(null);
    setFormData({
      name: "",
      type: "",
      address: "",
      coordinates: [0, 0],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "longitude" || name === "latitude") {
      const coordIndex = name === "longitude" ? 0 : 1;
      const newCoords = [...formData.coordinates];
      newCoords[coordIndex] = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        coordinates: newCoords,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        location: {
          type: "Point",
          coordinates: formData.coordinates,
        },
      };

      const response = await api.put(
        `/api/admin/updateLocation?placeId=${updatePlaceId}`,
        { updateData }
      );

      if (response.data.success) {
        console.log("success");

        handleCloseModal();
        return await fetchPlaces();
      }
      setErrorMessage(response.data.message);
      return setErrorModal(true);
    } catch (error) {
      console.error("Error updating place:", error);
      setErrorMessage(response.data.message);
      setErrorModal(true);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="adminPlaceList-container">
        <div className="adminPlaceList-loading">
          <div className="adminPlaceList-spinner"></div>
          <p>Loading places...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="adminPlaceList-container">
        <div className="adminPlaceList-header">
          <h1 className="adminPlaceList-title">
            <Building className="adminPlaceList-icon" />
            Manage Places
          </h1>
          <div className="adminPlaceList-stats">
            <span className="adminPlaceList-count">
              Total Places: {places.length}
            </span>
          </div>
        </div>

        <div className="adminPlaceList-grid">
          {places.map((place) => (
            <div key={place._id} className="adminPlaceList-card">
              <div className="adminPlaceList-cardHeader">
                <h3 className="adminPlaceList-placeName">{place.name}</h3>
                <button
                  className="adminPlaceList-editBtn"
                  onClick={() => handleEdit(place)}
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>

              <div className="adminPlaceList-cardBody">
                <div className="adminPlaceList-field">
                  <span className="adminPlaceList-label">Type:</span>
                  <span className="adminPlaceList-value">{place.type}</span>
                </div>

                <div className="adminPlaceList-field">
                  <span className="adminPlaceList-label">Address:</span>
                  <span className="adminPlaceList-value">{place.address}</span>
                </div>

                <div className="adminPlaceList-field">
                  <span className="adminPlaceList-label">
                    <MapPin size={14} />
                    Coordinates:
                  </span>
                  <span className="adminPlaceList-coordinates">
                    {place.location.coordinates[1].toFixed(4)},{" "}
                    {place.location.coordinates[0].toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="adminPlaceList-pagination">
          <button
            className={`adminPlaceList-pageBtn ${
              currentPage === 1 ? "adminPlaceList-disabled" : ""
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="adminPlaceList-pageNumbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`adminPlaceList-pageNumber ${
                  currentPage === page ? "adminPlaceList-active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className={`adminPlaceList-pageBtn ${
              currentPage === totalPages ? "adminPlaceList-disabled" : ""
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Edit Modal */}
        {showModal && (
          <div className="adminPlaceList-modalOverlay">
            <div className="adminPlaceList-modal">
              <div className="adminPlaceList-modalHeader">
                <h2 className="adminPlaceList-modalTitle">Edit Place</h2>
                <button
                  className="adminPlaceList-closeBtn"
                  onClick={handleCloseModal}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="adminPlaceList-form">
                <div className="adminPlaceList-formGroup">
                  <label className="adminPlaceList-formLabel">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="adminPlaceList-formInput"
                    required
                  />
                </div>

                <div className="adminPlaceList-formGroup">
                  <label className="adminPlaceList-formLabel">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="adminPlaceList-formInput"
                    required
                  />
                </div>

                <div className="adminPlaceList-formGroup">
                  <label className="adminPlaceList-formLabel">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="adminPlaceList-formTextarea"
                    rows="3"
                    required
                  />
                </div>

                <div className="adminPlaceList-coordsGroup">
                  <div className="adminPlaceList-formGroup">
                    <label className="adminPlaceList-formLabel">
                      Longitude
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.coordinates[0]}
                      onChange={handleInputChange}
                      className="adminPlaceList-formInput"
                      step="any"
                      required
                    />
                  </div>

                  <div className="adminPlaceList-formGroup">
                    <label className="adminPlaceList-formLabel">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.coordinates[1]}
                      onChange={handleInputChange}
                      className="adminPlaceList-formInput"
                      step="any"
                      required
                    />
                  </div>
                </div>

                <div className="adminPlaceList-modalFooter">
                  <button
                    type="button"
                    className="adminPlaceList-cancelBtn"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="adminPlaceList-saveBtn"
                    onClick={handleUpdate}
                  >
                    <Save size={16} />
                    Update Place
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {errorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}
    </>
  );
};

export default AdminPlaceList;
