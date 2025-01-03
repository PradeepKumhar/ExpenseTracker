import React from "react";

const AddExpense = ({ formData, onChange, onSubmit, onBulkFileChange, onBulkUpload }) => {
  const [loading, setLoading] = React.useState(false); // For loading state
  const [errorMessage, setErrorMessage] = React.useState(""); // For error feedback

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <form onSubmit={onSubmit} className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>

      {errorMessage && (
        <div className="mb-4 text-red-600">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount *
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={onChange}
          className="w-full mt-1 p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium">
          Category *
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={onChange}
          className="w-full mt-1 p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          className="w-full mt-1 p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium">
          Date *
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={onChange}
          className="w-full mt-1 p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow ${
          loading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Add Expense"}
      </button>
    </form>
  );
};

export default AddExpense;
