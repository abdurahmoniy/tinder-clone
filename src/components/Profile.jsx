import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({ userData, setUserData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        // birthDay: "",
        // gender: "",
        // city: ""
    });
    const [loading, setLoading] = useState(true);
    const [currentUserData, setCurrentUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate("/login");
        } else {
            setFormData({
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                // birthDay: userData.birthDay,
                // gender: userData.gender,
                // city: userData.city,
            });

            const fetchUser = async () => {
                try {
                    const response = await axios.get(
                        `https://5410-31-135-213-5.ngrok-free.app/api/users/${userData.userId}`,
                        {
                            headers: {
                                'ngrok-skip-browser-warning': 'true',
                            },
                        }
                    );
                    setCurrentUserData(response.data);
                    setLoading(false);
                    // console.log(response.data)
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setLoading(false);
                }
            };

            fetchUser();
        }
    }, [userData, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `https://5410-31-135-213-5.ngrok-free.app/api/users/${userData.userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );
            console.log("form", setFormData)
            console.log("form", formData)
            console.log("Profile updated:", response.data);
            setUserData(response.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Profile update failed");
        }
    };

    if (!userData) return null;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUserData) {
        return <div>Error: User data not found</div>;
    }

    return (
        <div className='profile_container'>
            <div className="profile-head">
                {isEditing ? "Edit Profile" : "Profile"}
            </div>

            <div className="prof_wrap">

                <div className="profile-info">
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="prof_edit">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    placeholder='First Name'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    placeholder='Last Name'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    placeholder='Phone Number'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <input
                                    type="date"
                                    name="birthDay"
                                    value={formData.birthDay}
                                    placeholder='Birth day'
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="prof_edit">
                                <select
                                    className="register-input"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="MALE">MALE</option>
                                    <option value="FEMALE">FEMALE</option>
                                </select>
                            </div>
                            <div className="action-btn">
                                <button type='submit'>Save Changes</button>
                                <button type='button' onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className='prof'>
                            <div className="prof_img">
                                <img
                                    src={currentUserData.profilePicture === 0 || !currentUserData.profilePicture
                                        ? "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"
                                        : currentUserData.profilePicture}
                                    alt="Profile"
                                />

                            </div>
                            <div className="prof_name">
                                <div className="name">
                                    {userData.firstName} {userData.lastName}
                                </div>
                                <div className="bio">
                                    {currentUserData.bio}
                                </div>
                            </div>
                            <div className="prof_info">
                                <div>User ID: {currentUserData.id}</div>
                                <div>Phone Number: {userData.phoneNumber}</div>
                                <div>Birthday: {currentUserData.birthDate}</div>
                                <div>Gender: {currentUserData.gender}</div>
                                <div>Interested: {currentUserData.interestedIn}</div>
                                <div>City: {currentUserData.city}</div>
                                <div>Interests: {currentUserData.interests}</div>
                            </div>
                        </div>
                    )}
                    <div className="action-btn">
                        {!isEditing && <button onClick={() => setIsEditing(true)}>Edit Profile</button>}
                        <button
                            onClick={() => {
                                localStorage.removeItem("authToken");
                                navigate("/login");
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
