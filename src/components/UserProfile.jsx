import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const UserProfile = ({ userData, setUserData, handleLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState(userData);

  useEffect(() => {
    setEditedUserData(userData);
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        `https://5410-31-135-213-5.ngrok-free.app/api/users/${userData.userId}`,
        editedUserData,
        {
            withCredentials: true,
        })
      .then((response) => {
        localStorage.setItem('userData', JSON.stringify(editedUserData));
        setUserData(editedUserData);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error saving user data:', error);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUserData(userData);
  };

  return (
    <div className="profile_container">
      <div className="profile-head">Profile</div>
      <div className="prof_wrap">
        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="prof_edit">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={editedUserData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="prof_edit">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={editedUserData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="prof_edit">
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={editedUserData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="prof_edit">
                <input
                  type="date"
                  name="birthDay"
                  placeholder="Birth day"
                  value={editedUserData.birthDay}
                  onChange={handleInputChange}
                />
              </div>
              <div className="prof_edit">
                <select
                  name="gender"
                  value={editedUserData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>
              <div className="action-btn">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="prof">
              <div className="prof_img">
                <img
                  src={
                    editedUserData.profilePicture ||
                    'https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg'
                  }
                  alt="Profile"
                />
              </div>
              <div className="prof_name">
                <div className="name">
                  {editedUserData.firstName} {editedUserData.lastName}
                </div>
                <div className="bio">{editedUserData.bio}</div>
              </div>
              <div className="prof_info">
                <div>User ID: {editedUserData.userId}</div>
                <div>Phone Number: {editedUserData.phoneNumber}</div>
                <div>Birthday: {editedUserData.birthDay}</div>
                <div>Gender: {editedUserData.gender}</div>
                <div>Interested: {editedUserData.interests}</div>
                <div>City: {editedUserData.city}</div>
              </div>
              <div className="action-btn">
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
