import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div class="three-body">
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
      </div>
    </div>
  );
};

export default Loader;
