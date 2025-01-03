const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Utility function to handle fetch requests with retry logic and error handling
const fetchFromAPI = async (url, options = {}, retries = 3) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));  // handle non-JSON responses gracefully
      if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error(data.msg || `Error ${response.status}: ${data.message || 'Request failed'}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying request... Attempts left: ${retries}`);
      return fetchFromAPI(url, options, retries - 1); // Retry on failure
    }

    console.error('API Error:', error);
    throw new Error(error.message || 'An error occurred during the request');
  }
};

// Fetch all expenses from the API
export const fetchExpensesFromAPI = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token is missing. Please log in again.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return fetchFromAPI("/api/expenses", { headers });
};

// Upload bulk expenses to the API
export const uploadBulkExpensesAPI = async (expenses) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token is missing. Please log in again.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return fetchFromAPI("/api/expenses/bulk-add", {
    method: "POST",
    headers,
    body: JSON.stringify({ expenses }),
  });
};
