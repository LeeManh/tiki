import React from "react";
import { useNavigate } from "react-router-dom";

const ButtonBack = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className="btn-form" onClick={handleBack}>
      Back
    </button>
  );
};

export default ButtonBack;
