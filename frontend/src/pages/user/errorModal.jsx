import React from 'react';
import '../../assets/css/user/ErrorModal.css';

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="errorModal-overlay">
      <div className="errorModal-container">
        <button className="errorModal-close" onClick={onClose}>&times;</button>
        <h2 className="errorModal-title">Error</h2>
        <p className="errorModal-message" style={{color:"red"}}>{message}</p>
      </div>
    </div>
  );
};

export default ErrorModal;
