import React, { useEffect, useState } from "react";
import { FaRegHeart, FaTimesCircle } from "react-icons/fa"; // except and reject icons
import api from "./api";
import Loader from "./Loader";

export default function Mylikes() {
  const [data, setData] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [detailModal, setDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(""); // State for toast message

  const fetchUsers = async () => {
    try {
      const response = await api.get("/likes/get-all");
      console.log(response);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLike = async (userId) => {
    try {
      const response = await api.post("/likes", { userId });
      if (response.status === 200) {
        setToast("User liked successfully!"); // Set the toast message
        setTimeout(() => setToast(""), 2000); // Hide after 2 seconds
        console.log("User liked");
      }
    } catch (error) {
      console.error("Error liking user:", error.message);
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await api.delete("/likes", { data: { userId } });
      if (response.status === 200) {
        setToast("User rejected successfully!"); // Set the toast message
        setTimeout(() => setToast(""), 2000); // Hide after 2 seconds
        console.log("User rejected");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error rejecting user:", error.message);
    }
  };

  const defaultImage =
    "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";

  return (
    <div style={{ height: "70%", padding: "20px" }} className="likes-wrap">
      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <p>{toast}</p>
        </div>
      )}

      <div className="likes-title">Liked users</div>

      {loading ? (
        <div className="loader-wrap">
          <Loader />
        </div>
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
                <div className="liked-first">
                  <div
                    onClick={() => {
                      setUserDetail(user);
                      setDetailModal(true);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
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
                    style={{ display: "flex", gap: 10 }}
                    className="liked-actions"
                  >
                    <button
                      onClick={() => handleLike(user.id)}
                      className="liked-action-btn"
                    >
                      <FaRegHeart className="liked-action-btn" />
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="liked-action-btn reject"
                    >
                      <FaTimesCircle className="reject" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
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
              <div className="detail-modal-detail-text">
                Age:{" "}
                <span className="detail-modal-text">{userDetail?.age}</span>
              </div>
              {userDetail?.bio && (
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
                  Interests:
                  <span className="detail-modal-text">
                    {userDetail?.interests}
                  </span>
                </div>
              )}
              {userDetail?.languages && (
                <div className="detail-modal-detail-text">
                  Languages:
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
