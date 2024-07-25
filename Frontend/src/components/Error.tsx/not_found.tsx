import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
// import './errorStyles.css';

const Error = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-container">
      <div className="error">
        <div className="error-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h2>We are not able to navigate to the given route at the moment</h2>
        <p className="mb-5">
          Please check the URL for any spelling errors or try again later.
        </p>
        <button className="back-button" onClick={goBack}>
          Go Back
        </button>
        <NavLink to="/" className="home-link">
          Back to Homepage
        </NavLink>
      </div>
    </div>
  );
};

export default Error;
