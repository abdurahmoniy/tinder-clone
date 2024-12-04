import React, { useState, useEffect } from 'react';
import './Profile.css';
import api from './api';

const UserProfile = ({ userData, setUserData, handleLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState(userData);
    const [currentUserData, setCurrentUserData] = useState(null);

    // Sync editedUserData with userData prop
    useEffect(() => {
        setEditedUserData(userData);
    }, [userData]);

    // Fetch current user data from the server
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/users/${userData.userId}`);
                setCurrentUserData(response.data);
                // console.log(response.data)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userData.userId]); // Dependency ensures the effect runs if userId changes

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
            const response = await api.put(`/users/${userData.userId}`, editedUserData);

            const updatedData = { ...userData, ...response.data }; // Merge response with existing userData
            setUserData(updatedData); // Update parent state
            setCurrentUserData(updatedData); // Sync currentUserData
            localStorage.setItem('userData', JSON.stringify(updatedData));

            setIsEditing(false);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUserData(userData); // Reset to original userData
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
                                    value={editedUserData.firstName || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={editedUserData.lastName || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={editedUserData.phoneNumber || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <input
                                    type="text"
                                    name="bio"
                                    placeholder="Bio"
                                    value={editedUserData.bio || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <input
                                    type="date"
                                    name="birthDate"
                                    placeholder="Birth day"
                                    value={editedUserData.birthDate || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={editedUserData.city || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <select
                                    name="gender"
                                    value={editedUserData.gender || ''}
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
                    ) : currentUserData ? (
                        <div className="prof">
                            <div className="prof_img">
                                <img
                                    src={
                                        currentUserData.profilePicture ||
                                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvIDLyE2qiXbONA33TsxXBaa9vUEn3VxXw3A&s'
                                    }
                                    alt="Profile"
                                />
                            </div>
                            <div className="prof_name">
                                <div className="name">
                                    {currentUserData.firstName || ''} {currentUserData.lastName || ''}
                                </div>
                                <div className="bio">{currentUserData.bio || 'N/A'}</div>
                            </div>
                            <div className="prof_info">
                                <div>User ID: {currentUserData.id || 'N/A'}</div>
                                <div>Phone Number: {currentUserData.phoneNumber || 'N/A'}</div>
                                <div>Birthday: {currentUserData.birthDate || 'N/A'}</div>
                                <div>Gender: {currentUserData.gender || 'N/A'}</div>
                                <div>City: {currentUserData.city || 'N/A'}</div>
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
        </div>
    );
};

export default UserProfile;
