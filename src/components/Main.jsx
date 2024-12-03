import React, { useState, useMemo, useRef, useContext, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import logo from '../img/logo.png';
import { useNavigate } from 'react-router-dom';

function Advanced({ db }) {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Create refs after db is available
  const childRefs = useMemo(
    () =>
      db.map(() => React.createRef()), // Create a new ref for each element in db
    [db] // Recalculate when db changes
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
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

  return (
    <div className="wrap">
      <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />
      <img className="logo" src={logo} />
      <div className="cardContainer">
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.firstName}
            onSwipe={(dir) => swiped(dir, character.firstName, index)}
            onCardLeftScreen={() => outOfFrame(character.firstName, index)}
          >
            <div style={{ backgroundImage: 'url(' + randImg + ')' }} className="card">
              <h3>{character.firstName}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button className="dislike" style={{ backgroundColor: '#c3c4d3' }} onClick={() => swipe('left')}>
          <i className="fas fa-heart-crack"></i>
        </button>
        <button className="undo" style={{ backgroundColor: '#000' }} onClick={() => goBack()}>
          <i className="fas fa-undo"></i>
        </button>
        <button className="like" style={{ backgroundColor: '#ff5f54e4' }} onClick={() => swipe('right')}>
          <i className="fas fa-heart"></i>
        </button>
      </div>
      {/* {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )} */}
    </div>
  );
}

export default Advanced;
