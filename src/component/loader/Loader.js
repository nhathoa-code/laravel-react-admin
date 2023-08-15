import React from "react";
import "./Loader.css";
const Loader = ({ style = null }) => {
  return (
    <div style={style ? style : {}} class="loader-container">
      <svg width="34" height="40" viewBox="-1 0 33 12">
        <circle
          class="stardust-spinner__spinner"
          cx="4"
          cy="6"
          r="4"
          fill="#041e3a"
        ></circle>
        <circle
          class="stardust-spinner__spinner"
          cx="16"
          cy="6"
          r="4"
          fill="#041e3a"
        ></circle>
        <circle
          class="stardust-spinner__spinner"
          cx="28"
          cy="6"
          r="4"
          fill="#041e3a"
        ></circle>
      </svg>
    </div>
  );
};

export default Loader;
