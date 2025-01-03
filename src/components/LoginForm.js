// src/components/LoginForm.js
import React, { useState } from 'react';

const LoginForm = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on new submission

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);  // Store JWT token
        setAuth(true);
        window.location.href = '/dashboard';  // Redirect to dashboard
      } else {
        setErrorMessage('Invalid credentials!'); // Set error message for invalid login
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while logging in!');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      {errorMessage && (
        <div className="bg-red-500 text-white text-center py-2 mb-4 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
