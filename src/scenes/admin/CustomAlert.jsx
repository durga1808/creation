import React from "react";
import "./CustomAlert.css";

const CustomAlert = ({message}) => {
  return (
    <div className="overlay">
      <div className="message-box">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default CustomAlert;
