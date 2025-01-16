import { locationsData } from "../locations/regions";
import { MdAddToPhotos } from "react-icons/md";
import React, { useState, useEffect } from "react";
import "./Profile.css";
import api from "./api";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Loader from "./Loader";

const UserProfile = ({ userData, setUserData, handleLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState(userData);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleGet = () => {
    setInterests(userData?.interests);
    setLanguages(userData?.languages);
    setRegion(userData?.region);
    setDistrict(userData?.district);
  };

  const handleInterestAdd = () => {
    if (interestInput && !interests?.includes(interestInput)) {
      setInterests((prev) =>
        Array.isArray(prev) ? [...prev, interestInput] : [interestInput]
      );
      setInterestInput("");
    }
  };

  const handleInterestRemove = (interest) => {
    setInterests((prev) => prev.filter((item) => item !== interest));
  };

  const handleLanguageAdd = () => {
    if (languageInput && !languages?.includes(languageInput)) {
      setLanguages((prev) =>
        Array.isArray(prev) ? [...prev, languageInput] : [languageInput]
      );
      setLanguageInput("");
    }
  };

  const handleLanguageRemove = (language) => {
    setLanguages((prev) => prev.filter((item) => item !== language));
  };

  useEffect(() => {
    setEditedUserData(userData);
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/users/me`);
      setCurrentUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userData.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...editedUserData,
      interests,
      languages,
      region,
      district,
    };

    try {
      const response = await api.put(`/users/update-me`, updatedData);

      const finalUpdatedData = { ...userData, ...response.data.data };

      setUserData(finalUpdatedData);
      setCurrentUserData(finalUpdatedData);
      localStorage.setItem("userData", JSON.stringify(finalUpdatedData));

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUserData(userData);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post("/files/upload-photo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          const newPath = response.data.data.path;
          const updatedUserData = {
            ...currentUserData,
            profilePicture: newPath,
          };
          fetchUserData();
          setCurrentUserData(updatedUserData);
          setUserData(updatedUserData);
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index); // Set the index of the clicked image
    setIsLightboxOpen(true); // Open the lightbox
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false); // Close the lightbox
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);

    const selectedRegionData = locationsData.find(
      (location) => location.region === selectedRegion
    );
    setDistricts(
      selectedRegionData ? Object.entries(selectedRegionData.districts) : []
    );
  };

  const handleDeleteProfilePicture = async () => {
    try {
      const response = await api.delete(`/files/delete-photo`);
      if (response.data.success) {
        const updatedUserData = { ...currentUserData, profilePicture: null };
        setCurrentUserData(updatedUserData);
        setUserData(updatedUserData);
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  return (
    <div className="profile_container">
      <div className="profile-head">
        {isEditing ? "Edit Profile" : "Profile"}
      </div>
      <div className="prof_wrap">
        <div className="profile-info">
          {isEditing ? (
            <form className="profile-edit-form" onSubmit={handleSubmit}>
              {/* first name */}
              <div className="prof_edit">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={editedUserData.firstName || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* last name */}
              <div className="prof_edit">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={editedUserData.lastName || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* bio */}
              <div className="prof_edit">
                <input
                  type="text"
                  name="bio"
                  placeholder="Bio"
                  value={editedUserData.bio || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* bio visibility */}
              <div className="prof_edit_checkbox">
                <label htmlFor="bioVisibility">Bio Visibility</label>
                <div>
                  <input
                    type="radio"
                    name="bioVisibility"
                    value="true"
                    checked={editedUserData.bioVisibility === true}
                    onChange={(e) =>
                      setEditedUserData((prev) => ({
                        ...prev,
                        bioVisibility: e.target.value === "true",
                      }))
                    }
                  />
                  <label>Public</label>
                </div>

                <div>
                  <input
                    type="radio"
                    name="bioVisibility"
                    value="false"
                    checked={editedUserData.bioVisibility === false}
                    onChange={(e) =>
                      setEditedUserData((prev) => ({
                        ...prev,
                        bioVisibility: e.target.value === "true",
                      }))
                    }
                  />
                  <label>Private</label>
                </div>
              </div>

              {/* birth date */}
              <div className="prof_edit">
                <input
                  type="date"
                  name="birthDate"
                  placeholder="Birth day"
                  value={
                    editedUserData.birthDate
                      ? editedUserData.birthDate.replace(/\./g, "-") // Display in YYYY-MM-DD format
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    // If the value is in the format YYYY-MM-DD, convert it to YYYY.MM.DD
                    const formattedDate = value ? value.replace(/-/g, ".") : "";
                    handleInputChange({
                      target: { name: "birthDate", value: formattedDate },
                    });
                  }}
                />
              </div>

              {/* age preference visibility */}
              <div className="prof_edit_checkbox">
                <label htmlFor="agePreferenceVisibility">
                  Age Preference Visibility
                </label>
                <div>
                  <input
                    type="radio"
                    name="agePreferenceVisibility"
                    value="true"
                    checked={editedUserData.agePreferenceVisibility === true}
                    onChange={(e) =>
                      setEditedUserData((prev) => ({
                        ...prev,
                        agePreferenceVisibility: e.target.value === "true",
                      }))
                    }
                  />
                  <label>Public</label>
                </div>

                <div>
                  <input
                    type="radio"
                    name="agePreferenceVisibility"
                    value="false"
                    checked={editedUserData.agePreferenceVisibility === false}
                    onChange={(e) =>
                      setEditedUserData((prev) => ({
                        ...prev,
                        agePreferenceVisibility: e.target.value === "true",
                      }))
                    }
                  />
                  <label>Private</label>
                </div>
              </div>

              {/* gender */}
              <div className="prof_edit">
                <select
                  name="gender"
                  value={editedUserData.gender || ""}
                  onChange={handleInputChange}
                  className="gender-input"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>

              {/* region */}
              <select
                className="gender-input"
                name="regions"
                onChange={handleRegionChange}
              >
                <option value="">Select region</option>
                {locationsData?.map((region) => (
                  <option key={region.region} value={region.region}>
                    {region.region}
                  </option>
                ))}
              </select>

              {/* district */}
              <select
                className="gender-input"
                name="districts"
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Select district</option>
                {districts?.map(([districtKey, districtName]) => (
                  <option key={districtKey} value={districtName}>
                    {districtName}
                  </option>
                ))}
              </select>

              {/* show me on Tinder (global) */}
              <div className="prof_edit_checkbox">
                <label htmlFor="showMeOnTinder">
                  Show Me on Tinder (Global)
                </label>
                <div>
                  <input
                    type="radio"
                    name="showMeOnTinder"
                    value="true"
                    checked={editedUserData.showMeOnTinder === true}
                    onChange={(e) =>
                      setEditedUserData((prev) => ({
                        ...prev,
                        showMeOnTinder: e.target.value === "true",
                      }))
                    }
                  />
                  <label>Yes</label>
                </div>

                <div>
                  <input
                    type="radio"
                    name="showMeOnTinder"
                    value="false"
                    checked={editedUserData.showMeOnTinder === false}
                    onChange={(e) =>
                      setEditedUserData((prev) => ({
                        ...prev,
                        showMeOnTinder: e.target.value === "true",
                      }))
                    }
                  />
                  <label>No</label>
                </div>
              </div>

              {/* education */}
              <div className="prof_edit">
                <input
                  type="text"
                  name="education"
                  placeholder="Education"
                  value={editedUserData?.education || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* interested in */}
              <div className="prof_edit_checkbox">
                <label htmlFor="interestedIn">Interested In</label>
                <div>
                  <input
                    type="radio"
                    name="interestedIn"
                    value="MALE"
                    checked={editedUserData.interestedIn === "MALE"}
                    onChange={(e) =>
                      setEditedUserData((prev) => ({
                        ...prev,
                        interestedIn: e.target.value,
                      }))
                    }
                  />
                  <label>Male</label>
                </div>

                <div>
                  <input
                    type="radio"
                    name="interestedIn"
                    value="FEMALE"
                    checked={editedUserData.interestedIn === "FEMALE"}
                    onChange={(e) =>
                      setEditedUserData((prev) => ({
                        ...prev,
                        interestedIn: e.target.value,
                      }))
                    }
                  />
                  <label>Female</label>
                </div>
              </div>

              {/* Interests */}
              <div className="edit-form-interested">
                <label htmlFor="interests">Interests</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="Add an interest"
                  />
                  <button type="button" onClick={handleInterestAdd}>
                    Add
                  </button>
                </div>

                <div className="item-list">
                  {interests?.map((interest, index) => (
                    <div key={index} className="item">
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => handleInterestRemove(interest)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="edit-form-languages">
                <label htmlFor="languages">Languages</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    placeholder="Add a language"
                  />
                  <button type="button" onClick={handleLanguageAdd}>
                    Add
                  </button>
                </div>

                <div className="item-list">
                  {languages?.map((language, index) => (
                    <div key={index} className="item">
                      <span>{language}</span>
                      <button
                        type="button"
                        onClick={() => handleLanguageRemove(language)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="action-btn">
                <button
                  style={{ backgroundColor: "#007bff" }}
                  className="edit-profile-save-btn"
                  type="submit"
                >
                  Save Changes
                </button>
                <button
                  style={{ backgroundColor: "#dc3545" }}
                  className="edit-profile-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : currentUserData ? (
            <div className="prof">
              <div className="prof_img">
                <img
                  src={
                    currentUserData?.profilePictures == null
                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr3jhpAFYpzxx39DRuXIYxNPXc0zI5F6IiMQ&s"
                      : currentUserData?.profilePictures[
                          currentUserData?.profilePictures?.length - 1
                        ]
                  }
                  alt="Profile"
                  onClick={() =>
                    handleImageClick(
                      currentUserData?.profilePictures?.length - 1
                    )
                  }
                />
                <label
                  style={{
                    position: "absolute",
                    right: -5,
                    bottom: -15,
                    cursor: "pointer",
                  }}
                >
                  <MdAddToPhotos style={{ width: 50, height: "auto" }} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="prof_name">
                <div className="name">
                  {currentUserData.firstName || ""}{" "}
                  {currentUserData.lastName || ""}
                </div>
                <div className="bio">
                  {currentUserData.bio || "Write a bio..."}
                </div>
              </div>
              <div className="prof_info">
                {/* <div>Phone Number: {currentUserData.phoneNumber || "N/A"}</div> */}
                <div>Birthday: {currentUserData.birthDate || "N/A"}</div>
                <div>Gender: {currentUserData.gender || "N/A"}</div>
                {currentUserData?.education && (
                  <div>Education: {currentUserData?.education}</div>
                )}
                <div>
                  Location: {currentUserData?.region || ""},{" "}
                  {currentUserData?.district || ""}
                </div>
              </div>
              <div className="action-btn">
                <button onClick={() => setConfirmLogout(true)}>Logout</button>
                <button
                  style={{ backgroundColor: "#007bff" }}
                  onClick={() => {
                    setIsEditing(true);
                    handleGet();
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>

      {/* Lightbox Component */}
      {isLightboxOpen && currentUserData?.profilePictures && (
        <Lightbox
          mainSrc={currentUserData.profilePictures[currentImageIndex]}
          nextSrc={
            currentUserData.profilePictures[
              (currentImageIndex + 1) % currentUserData.profilePictures.length
            ]
          }
          prevSrc={
            currentUserData.profilePictures[
              (currentImageIndex + currentUserData.profilePictures.length - 1) %
                currentUserData.profilePictures.length
            ]
          }
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() =>
            setCurrentImageIndex(
              (currentImageIndex + currentUserData.profilePictures.length - 1) %
                currentUserData.profilePictures.length
            )
          }
          onMoveNextRequest={() =>
            setCurrentImageIndex(
              (currentImageIndex + 1) % currentUserData.profilePictures.length
            )
          }
        />
      )}

      {/* logout confirm modal */}
      {confirmLogout && (
        <div
          onClick={() => setConfirmLogout(false)}
          className="confirm-logout-modal"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="confirm-logout-modal-content"
          >
            <h3 style={{ marginBottom: 20 }}>
              Are you sure you want to logout?
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setConfirmLogout(false)}
                className="confirm-logout-modal-cancel-btn"
              >
                No, Cancel
              </button>
              <button
                className="confirm-logout-modal-logout-btn"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
