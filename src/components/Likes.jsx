import React, { useEffect, useState } from "react";
import api from "./api";
import { FaRegTrashAlt } from "react-icons/fa";
import Loader from "./Loader";
import "./likes.css";

export default function Likes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [alertMessage, setAlertMessage] = useState(""); // Added state for alert message
  const [alertStatus, setAlertStatus] = useState(""); // Added state for alert status

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/likes/get-all-mine");
        if (response.status === 200 && Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const defaultImage =
    "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";

  const handleReject = async (userId) => {
    try {
      const response = await api.delete("/likes/mine", { data: { userId } });
      if (response.status === 200) {
        setData((prevData) => prevData.filter((user) => user.id !== userId));
        // Set success message
        setAlertMessage(`User with ID: ${userId} has been rejected.`);
        setAlertStatus("success");

        // Hide the message after 2 seconds
        setTimeout(() => {
          setAlertMessage("");
          setAlertStatus("");
        }, 2000);
      } else {
        // Set failure message
        setAlertMessage("Failed to reject user.");
        setAlertStatus("fail");

        // Hide the message after 2 seconds
        setTimeout(() => {
          setAlertMessage("");
          setAlertStatus("");
        }, 2000);
      }
    } catch (error) {
      // Set error message
      console.error("Error rejecting user:", error.message);
      setAlertMessage("Error rejecting user.");
      setAlertStatus("fail");

      // Hide the message after 2 seconds
      setTimeout(() => {
        setAlertMessage("");
        setAlertStatus("");
      }, 2000);
    }
  };

  return (
    <div style={{ height: "70%", padding: "20px" }} className="likes-wrap">
      <div className="likes-title">Liked users</div>

      {alertMessage && (
        <div className={`toast-message ${alertStatus}`}>{alertMessage}</div>
      )}

      {loading ? (
        <Loader />
      ) : data.length === 0 ? (
        <div className="users-finished">
          <div className="snowflakes" aria-hidden="true">
            {[...Array(10)].map((_, idx) => (
              <img key={idx} src="logo.png" alt="logo" className="snowflake" />
            ))}
          </div>
          <p className="users-finished-message">You have no likes</p>
        </div>
      ) : (
        <div className="likes-cont">
          {data.map((user) => {
            const userImage = user.profilePictures?.[0] || defaultImage;
            return (
              <div key={user.id} className="liked-user-item">
                <div
                  onClick={() => {
                    setDetailModal(true);
                    setUserDetail(user);
                  }}
                  className="liked-first"
                >
                  <img
                    src={userImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="liked-user-avatar"
                  />
                  <div className="name">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
                <div
                  className="reject-icon"
                  onClick={() => handleReject(user.id)}
                >
                  <FaRegTrashAlt size={20} color="red" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* details modal */}
      {detailModal && (
        <div onClick={() => setDetailModal(false)} className="detail-modal">
          <div
            onClick={(e) => e.stopPropagation()}
            className="detail-modal-content"
          >
            <div style={{ width: "100%", textAlign: "center" }}>
              <img
                src={userDetail.profilePictures?.[0] || defaultImage}
                alt={`${userDetail.firstName} ${userDetail.lastName}`}
                className="detail-modal-avatar"
              />
            </div>
            <div className="detail-modal-info">
              <div className="detail-modal-name">
                {userDetail.firstName} {userDetail.lastName}
              </div>
              {userDetail?.agePreferenceVisibility == true && (
                <div className="detail-modal-detail-text">
                  Age:{" "}
                  <span className="detail-modal-text">{userDetail?.age}</span>
                </div>
              )}
              {userDetail?.bio && userDetail?.bioVisibility == true && (
                <div className="detail-modal-detail-text">
                  Bio:{" "}
                  <span className="detail-modal-text">{userDetail?.bio}</span>
                </div>
              )}
              {userDetail?.region && (
                <div className="detail-modal-detail-text">
                  Location:{" "}
                  <span className="detail-modal-text">
                    {userDetail?.region}, {userDetail?.district}
                  </span>
                </div>
              )}
              {userDetail?.education && (
                <div className="detail-modal-detail-text">
                  Education:{" "}
                  <span className="detail-modal-text">
                    {userDetail?.education}
                  </span>
                </div>
              )}
              {userDetail?.interests && (
                <div className="detail-modal-detail-text">
                  Interests:{" "}
                  <span className="detail-modal-text">
                    {userDetail?.interests}
                  </span>
                </div>
              )}
              {userDetail?.languages && (
                <div className="detail-modal-detail-text">
                  Languages:{" "}
                  <span className="detail-modal-text">
                    {userDetail?.languages}
                  </span>
                </div>
              )}
            </div>
            <button
              className="detail-modal-close"
              onClick={() => setDetailModal(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
