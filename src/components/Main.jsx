import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import logo from '../img/logo.png';
import { useNavigate } from 'react-router-dom';
import api from './api';

function Advanced({ db = [], setCurrentPage }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const childRefs = useMemo(() => {
    return Array.isArray(db) ? db.map(() => React.createRef()) : [];
  }, [db]);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = async (direction, nameToDelete, index, user) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    if (direction === 'right') {
      try {
        await api.post(`/likes`, { userId: user.id });
        console.log(`User ${user.firstName} (ID: ${user.id}) liked!`);
      } catch (error) {
        console.error('Error liking user:', error);
      }
    }
    
    // Increment the current page to fetch the next user
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    if (currentIndexRef.current >= idx && childRefs[idx]?.current) {
      childRefs[idx].current.restoreCard();
    }
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      if (childRefs[currentIndex]?.current) {
        await childRefs[currentIndex].current.swipe(dir);
      }
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    if (childRefs[newIndex]?.current) {
      await childRefs[newIndex].current.restoreCard();
    }
  };

  const randImg = 'https://pics.craiyon.com/2023-07-06/fabd5b7e86864d458a24a3624c7c7f23.webp';

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="wrap">
      <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />
      <img className="logo" src={logo} key="logo"/>
      <div className="cardContainer">
        {Array.isArray(db) && db.length > 0 ? (
          db.map((character, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={character.index}
              onSwipe={(dir) => swiped(dir, character.firstName, index, character)}
              onCardLeftScreen={() => outOfFrame(character.firstName, index)}
            >
              <div style={{ backgroundImage: `url(${randImg})` }} className="card">
                <div className="info">
                  <div className="info_name">
                    {character.firstName} <div className="age">{calculateAge(character.birthDate)}</div>
                  </div>
                  <div className="info_city">
                    <i className="fas fa-location-dot"></i> {character.city}
                  </div>
                </div>
              </div>
            </TinderCard>
          ))
        ) : (
          <p>No users available</p>
        )}
      </div>
      <div className="buttons">
        <button className="dislike" style={{ backgroundColor: '#c3c4d3' }} onClick={() => swipe('left')}>
          <i className="fas fa-heart-crack"></i>
        </button>
        <button className="undo" style={{ backgroundColor: '#000' }} onClick={() => goBack()}>
          <i className="fas fa-undo"></i>
        </button>
        <button
          className="like"
          style={{ backgroundColor: '#ff5f54e4' }}
          onClick={() => {
            swipe('right');
            setCurrentPage((prevPage) => prevPage + 1); // Increment page to load the next user
          }}
        >
          <i className="fas fa-heart"></i>
        </button>
      </div>
    </div>
  );
}

export default Advanced;
