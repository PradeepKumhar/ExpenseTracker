// src/pages/RegistrationPage.js
import React from 'react';
import RegistrationForm from '../components/RegistrationForm';
import Registration from '../assests/images/Registration.jpg'; // Ensure the path is correct

const RegistrationPage = () => {
  return (
    <div 
      style={{
        backgroundImage: `url(${Registration})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} 
      className="min-h-screen flex items-center justify-center"
    >
      <div className="max-w w-full bg-opacity-90 rounded">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegistrationPage;
