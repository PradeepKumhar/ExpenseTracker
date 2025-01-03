// src/pages/RegistrationPage.js
import React from 'react';
import RegistrationForm from '../components/RegistrationForm';

const RegistrationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 max-w-sm w-full">
        <RegistrationForm />

       
      </div>
    </div>
  );
};

export default RegistrationPage;
