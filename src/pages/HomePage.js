// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to the Expense Tracker</h1>
        <p className="text-gray-600 text-lg mb-8">
          Keep track of your expenses easily and stay on top of your budget.
        </p>

        <div className="space-x-4">
          <Link 
            to="/login" 
            className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-medium transition duration-300"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="text-white bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full font-medium transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
      
      <footer className="mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
