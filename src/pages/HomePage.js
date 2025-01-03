// src/pages/HomePage.js
import React from 'react';
import backgroundImage from '../assests/images/BackGround.jpg';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleCalculatorClick = () => {
    navigate('/calculator'); // Route to the calculator page
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-90 p-12 rounded-2xl shadow-3xl max-w-xl w-full text-center transform transition duration-500 hover:scale-105">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-6 tracking-wide leading-tight">
          Welcome to the Expense Tracker
        </h1>
        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
          Easily track your daily expenses, stay on top of your financial goals, and make smarter budget decisions.
        </p>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleRegisterClick}
            className="text-white bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105 shadow-lg ml-4"
          >
            Get Started
          </button>
          <button
            onClick={handleCalculatorClick}
            className="text-white bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition duration-300 transform hover:scale-105 shadow-lg ml-4"
          >
            Group Expense Calculator
          </button>
        </div>
      </div>

      <footer className="mt-12 text-gray-500 text-sm">
        <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
