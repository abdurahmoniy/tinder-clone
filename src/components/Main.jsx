import { IoMdMore } from "react-icons/io";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import React, { useState, useMemo, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Advanced() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState({});
  const [detailModal, setDetailModal] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users/get-all?page=0&size=100`);
      setUsers(response?.data?.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      // window.location.reload();
    }
  }, [navigate]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const childRefs = useMemo(() => {
    return users.map(() => React.createRef());
  }, [users]);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < users.length - 1;
  const canSwipe = currentIndex >= 0 && currentIndex < users.length - 1;

  const swiped = async (direction, nameToDelete, index, user) => {
    if (currentIndex >= users.length - 1) {
      return;
    }

    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    if (direction === "right") {
      try {
        await api.post(`/likes`, { userId: user.id });
        console.log(`User ${user.firstName} (ID: ${user.id}) liked!`);
        setActionMessage("You liked!"); // Set action message for like

        setTimeout(() => setActionMessage(""), 1000); // Clear message after 1 second
      } catch (error) {
        console.error("Error liking user:", error);
      }
    }
  };

  const handleMessage = (message) => {
    setActionMessage(message); // Set the message
    setTimeout(() => setActionMessage(""), 1000); // Clear message after 1 second
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    if (currentIndexRef.current >= idx && childRefs[idx]?.current) {
      childRefs[idx].current.restoreCard();
    }
  };

  const swipe = async (dir) => {
    if (currentIndex >= users.length - 1) {
      // Don't swipe if it's the last user
      return;
    }

    if (canSwipe && currentIndex < users.length) {
      if (childRefs[currentIndex]?.current) {
        await childRefs[currentIndex].current.swipe(dir);
      }
    }
  };

  const goBack = async () => {
    if (currentIndex >= users.length - 1) {
      // Don't go back if it's the last user
      return;
    }

    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    if (childRefs[newIndex]?.current) {
      await childRefs[newIndex].current.restoreCard();
    }
  };

  const randImg =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(
    users[currentIndex]?.profilePictures?.length - 1 || 0
  );

  const currentImage =
    users[currentIndex]?.profilePictures?.[currentImageIndex] || randImg;

  const handleNextImage = () => {
    if (users[currentIndex]?.profilePictures?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === users[currentIndex].profilePictures.length - 1
          ? 0
          : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (users[currentIndex]?.profilePictures?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0
          ? users[currentIndex].profilePictures.length - 1
          : prevIndex - 1
      );
    }
  };

  return (
    <div style={{ overflowY: "auto" }} className="wrap">
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <img className="logo" src="logo.svg" key="logo" />
      <div className="cardContainer">
        {users && users.length > 0 ? (
          users.map((character, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={character.index}
              onSwipe={(dir) =>
                swiped(dir, character.firstName, index, character)
              }
              onCardLeftScreen={() => outOfFrame(character.firstName, index)}
            >
              <div
                style={{
                  backgroundImage: `url(${currentImage})`,
                }}
                className="card"
              >
                <div className="info">
                  <div className="info_name">
                    <div>
                      {character.firstName} {character.lastName}
                    </div>
                    <div className="age">
                      {character?.age}
                      <p className="age-text">years old</p>
                    </div>
                  </div>
                  <div className="info_city">
                    <i className="fas fa-location-dot"></i> {character?.region},{" "}
                    {character?.district}
                  </div>
                </div>
                <IoMdMore
                  onClick={() => {
                    setUserDetail(character);
                    setDetailModal(true);
                  }}
                  className="card-more-icon"
                />
                <FaRegArrowAltCircleRight
                  onClick={handleNextImage}
                  className="card-right-arrow"
                />
                <FaRegArrowAltCircleLeft
                  onClick={handlePrevImage}
                  className="card-left-arrow"
                />
              </div>
            </TinderCard>
          ))
        ) : (
          <div className="users-finished">
            <div className="snowflakes" aria-hidden="true">
              <img src="logo.svg" alt="logo" className="snowflake" />
              <img src="logo.svg" alt="logo" className="snowflake" />
              <img src="logo.svg" alt="logo" className="snowflake" />
              <img src="logo.svg" alt="logo" className="snowflake" />
              <img src="logo.svg" alt="logo" className="snowflake" />

              <img src="logo.svg" alt="logo" className="snowflake" />
              <img src="logo.svg" alt="logo" className="snowflake" />
              <img src="logo.svg" alt="logo" className="snowflake" />
              <img src="logo.svg" alt="logo" className="snowflake" />
              <img src="logo.svg" alt="logo" className="snowflake" />
            </div>
            <p className="users-finished-message">Users Finished</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="buttons">
        <button
          className="dislike"
          style={{ backgroundColor: "#c3c4d3" }}
          onClick={() => {
            swipe("left");
            handleMessage("Skipped"); // Call handleMessage with the desired message
          }}
          disabled={currentIndex >= users.length - 1} // Disable for the last card
        >
          <i className="fas fa-heart-crack"></i>
        </button>
        <button
          className="undo"
          style={{ backgroundColor: "#000" }}
          onClick={() => goBack()}
          disabled={currentIndex >= users.length - 1} // Disable for the last card
        >
          <i className="fas fa-undo"></i>
        </button>
        <button
          className="like"
          style={{ backgroundColor: "#ff5f54e4" }}
          onClick={async () => {
            if (users[currentIndex]) {
              const user = users[currentIndex];
              try {
                await api.post("/likes", { userId: user.id });
                console.log(`User ${user.firstName} (ID: ${user.id}) liked!`);
                handleMessage("You liked!"); // Call handleMessage with the desired message
              } catch (error) {
                console.error("Error liking user:", error);
              }
            }
            swipe("right");
          }}
          disabled={currentIndex >= users.length - 1} // Disable for the last card
        >
          <i className="fas fa-heart"></i>
        </button>
      </div>

      {actionMessage && (
        <p className="action-message">{actionMessage}</p> // Display the action message
      )}

      {detailModal && (
        <div onClick={() => setDetailModal(false)} className="detail-modal">
          <div
            onClick={(e) => e.stopPropagation()}
            className="detail-modal-content"
          >
            <div style={{ width: "100%", textAlign: "center" }}>
              <img
                src={
                  userDetail.profilePictures?.[
                    userDetail?.profilePictures?.length - 1
                  ] || randImg
                }
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

export default Advanced;
