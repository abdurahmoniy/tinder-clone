import { locationsData } from "../locations/regions";
import { MdAddToPhotos } from "react-icons/md";
import React, { useState, useEffect } from "react";
import "./Profile.css";
import api from "./api";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const UserProfile = ({ userData, setUserData, handleLogout }) => {
  const [isEditing, setIsEditing] = useState(true);
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

  const handleInterestAdd = () => {
    if (interestInput && !interests.includes(interestInput)) {
      setInterests([...interests, interestInput]);
      setInterestInput("");
    }
  };

  const handleLanguageAdd = () => {
    if (languageInput && !languages.includes(languageInput)) {
      setLanguages([...languages, languageInput]);
      setLanguageInput("");
    }
  };

  const handleInterestRemove = (interest) => {
    setInterests(interests.filter((item) => item !== interest));
  };

  const handleLanguageRemove = (language) => {
    setLanguages(languages.filter((item) => item !== language));
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

    try {
      const response = await api.put(`/users/update-me`, editedUserData);

      const updatedData = { ...userData, ...response.data.data };
      setUserData(updatedData);
      setCurrentUserData(updatedData);
      localStorage.setItem("userData", JSON.stringify(updatedData));

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

  // edit form datas

  // {
  //   "success": true,
  //   "message": "string",
  //   "data": {
  //     "id": 0,
  //     "firstName": "string",
  //     "lastName": "string",
  //     "phoneNumber": "string",
  //     "username": "string",
  //     "age": 0,
  //     "birthDate": "2025-01-13",
  //     "gender": "MALE",
  //     "lastActiveTime": "2025-01-13T13:28:56.687Z",
  //     "bio": "string",
  //     "bioVisibility": true,
  //     "region": "string",
  //     "district": "string",
  //     "showMeOnTinder": true,
  //     "minAgePreference": 0,
  //     "maxAgePreference": 0,
  //     "agePreferenceVisibility": true,
  //     "global": true,
  //     "appearanceMode": "DARK",
  //     "education": "string",
  //     "interestedIn": "MALE",
  //     "profilePictures": [
  //       "string"
  //     ],
  //     "interests": [
  //       "string"
  //     ],
  //     "languages": [
  //       "string"
  //     ]
  //   }
  // }

  return (
    <div className="profile_container">
      <div className="profile-head">
        {isEditing ? "Edit Profile" : "Profile"}
      </div>
      <div className="prof_wrap">
        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
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

              {/* phone number */}
              <div className="prof_edit">
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={editedUserData.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* age */}
              <div className="prof_edit">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={editedUserData?.age || ""}
                  onChange={handleInputChange}
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
                    checked={editedUserData.agePreferenceVisibility === "true"}
                    onChange={handleInputChange}
                  />
                  <label>Public</label>
                </div>

                <div>
                  <input
                    type="radio"
                    name="agePreferenceVisibility"
                    value="false"
                    checked={editedUserData.agePreferenceVisibility === "false"}
                    onChange={handleInputChange}
                  />
                  <label>Private</label>
                </div>
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
                    checked={editedUserData.bioVisibility === "true"}
                    onChange={handleInputChange}
                  />
                  <label>Public</label>
                </div>

                <div>
                  <input
                    type="radio"
                    name="bioVisibility"
                    value="false"
                    checked={editedUserData.bioVisibility === "false"}
                    onChange={handleInputChange}
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
                  value={editedUserData.birthDate || ""}
                  onChange={handleInputChange}
                />
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

              {/* show me on Tinder */}
              <div className="prof_edit_checkbox">
                <label htmlFor="showMeOnTinder">Show Me on Tinder</label>
                <div>
                  <input
                    type="radio"
                    name="showMeOnTinder"
                    value="true"
                    checked={editedUserData.showMeOnTinder === "true"}
                    onChange={handleInputChange}
                  />
                  <label>Yes</label>
                </div>

                <div>
                  <input
                    type="radio"
                    name="showMeOnTinder"
                    value="false"
                    checked={editedUserData.showMeOnTinder === "false"}
                    onChange={handleInputChange}
                  />
                  <label>No</label>
                </div>
              </div>

              {/* min age preference */}
              <div className="prof_edit">
                <input
                  type="number"
                  name="minAgePreference"
                  placeholder="Min age preference"
                  value={editedUserData?.minAgePreference || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* max age preference */}
              <div className="prof_edit">
                <input
                  type="number"
                  name="maxAgePreference"
                  placeholder="Max age preference"
                  value={editedUserData?.minAgePreference || ""}
                  onChange={handleInputChange}
                />
              </div>

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
                    checked={editedUserData.showMeOnTinder === "true"}
                    onChange={handleInputChange}
                  />
                  <label>Yes</label>
                </div>

                <div>
                  <input
                    type="radio"
                    name="showMeOnTinder"
                    value="false"
                    checked={editedUserData.showMeOnTinder === "false"}
                    onChange={handleInputChange}
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
                    type="checkbox"
                    name="interestedIn"
                    value="MALE"
                    checked={editedUserData.interestedIn?.includes("MALE")}
                    onChange={handleInputChange}
                  />
                  <label>Male</label>
                </div>

                <div>
                  <input
                    type="checkbox"
                    name="interestedIn"
                    value="FEMALE"
                    checked={editedUserData.interestedIn?.includes("FEMALE")}
                    onChange={handleInputChange}
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
                  {interests.map((interest, index) => (
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
                  {languages.map((language, index) => (
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
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleCancel}>
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
                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvIDLyE2qiXbONA33TsxXBaa9vUEn3VxXw3A&s"
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
                <div>Phone Number: {currentUserData.phoneNumber || "N/A"}</div>
                <div>Birthday: {currentUserData.birthDate || "N/A"}</div>
                <div>Gender: {currentUserData.gender || "N/A"}</div>
                <div>
                  Location: {currentUserData?.region || ""},{" "}
                  {currentUserData?.district || ""}
                </div>
              </div>
              <div className="action-btn">
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
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
    </div>
  );
};

export default UserProfile;
