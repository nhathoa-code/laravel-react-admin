import React from "react";
import Icon from "./processing.gif";
import "./ProcessingIcon.css";

const ProcessingIcon = () => {
  return (
    <div id="processing-icon">
      <img style={{ width: "50px" }} src={Icon} />
    </div>
  );
};

export default ProcessingIcon;
