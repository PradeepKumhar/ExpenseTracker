// src/pages/LoginPage.js
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import loginImages from '../assests/images/Login.jpg'

const LoginPage = () => {
  const [isAuthenticated, setAuth] = useState(false);

  return (
    <div  style={{
            backgroundImage: `url(${loginImages})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}  className="bg-opacity-90 min-h-screen flex items-center justify-center">
      <div className=" p-8 rounded-lg max-w-sm w-full">

        {!isAuthenticated ? (
          <LoginForm setAuth={setAuth} />
        ) : (
          <div className="text-center">
            <p className="text-green-600 text-lg">You are logged in!</p>
            <p className="text-gray-500">Redirecting...</p>
          </div>
        )}
      
      </div>
    </div>
  );
};

export default LoginPage;
