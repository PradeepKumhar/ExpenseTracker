import React, { useEffect, useState, useMemo } from "react";
import FilterExpenses from "../components/Expense/FilterExpenses";
import AddExpense from "../components/Expense/AddExpense";
import ExpenseList from "../components/Expense/ExpenseList";
import Papa from "papaparse"; 
import { fetchExpensesFromAPI, uploadBulkExpensesAPI } from "../utils/api";

const Dashboard = () => {
  const [showFilter, setShowFilter] = useState(false);  // State for Filter visibility
  const [state, setState] = useState({
    expenses: [],
    filteredExpenses: [],
    formData: { amount: "", category: "", description: "", date: "" },
    filterData: {
      categoryFilter: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "date",
      sortOrder: "asc",
    },
    error: null,
    success: null,
    editMode: false,
    editExpenseId: null,
  });

  const [bulkFile, setBulkFile] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);  // State for Add Expense Button visibility
  const [showBulkUpload, setShowBulkUpload] = useState(false);  // State for Bulk Upload Button visibility

  // Fetch expenses when component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      const expenses = await fetchExpensesFromAPI();
      console.log("Expense from api: ", expenses);
      setState((prevState) => ({
        ...prevState,
        expenses,
        filteredExpenses: expenses,
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err.message || "Failed to fetch expenses",
      }));
    }
  };

  // Automatically clear error message after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        setState((prevState) => ({ ...prevState, error: null }));
      }, 5000); // Clear error after 5 seconds
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [state.error]);

  // Handle bulk file change (CSV upload)
  const handleBulkFileChange = (e) => {
    setBulkFile(e.target.files[0]);
  };

  // Handle bulk file upload
  const handleBulkUpload = async () => {
    if (!bulkFile) {
      setState((prevState) => ({
        ...prevState,
        error: "Please select a CSV file to upload",
      }));
      return;
    }

    // Parse and validate the CSV file
    Papa.parse(bulkFile, {
      complete: async (result) => {
        const expenses = result.data.map((row) => ({
          amount: parseFloat(row.Amount.replace(/,/g, "").trim()),
          category: row.Category.trim(),
          description: row.Description.trim(),
          date: row.Date.trim(),
        }));

        try {
          await uploadBulkExpensesAPI(expenses);
          fetchExpenses();
        } catch (err) {
          setState((prevState) => ({
            ...prevState,
            error: err.message || "Failed to upload bulk expenses",
          }));
        }
      },
      header: true,
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      filterData: { ...prevState.filterData, [name]: value },
    }));
  };

  // Apply filters to expenses
  const applyFilter = () => {
    let filtered = [...state.expenses];

    if (state.filterData.categoryFilter) {
      filtered = filtered.filter((expense) =>
        expense.category
          .toLowerCase()
          .includes(state.filterData.categoryFilter.toLowerCase())
      );
    }

    if (state.filterData.startDate) {
      filtered = filtered.filter(
        (expense) => new Date(expense.date) >= new Date(state.filterData.startDate)
      );
    }

    if (state.filterData.endDate) {
      filtered = filtered.filter(
        (expense) => new Date(expense.date) <= new Date(state.filterData.endDate)
      );
    }

    if (state.filterData.minAmount) {
      filtered = filtered.filter(
        (expense) => expense.amount >= parseFloat(state.filterData.minAmount)
      );
    }

    if (state.filterData.maxAmount) {
      filtered = filtered.filter(
        (expense) => expense.amount <= parseFloat(state.filterData.maxAmount)
      );
    }

    if (state.filterData.sortBy === "amount") {
      filtered = filtered.sort((a, b) => {
        return state.filterData.sortOrder === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      });
    } else {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return state.filterData.sortOrder === "asc"
          ? dateA - dateB
          : dateB - dateA;
      });
    }

    setState((prevState) => ({ ...prevState, filteredExpenses: filtered }));
  };

  // Handle form data change (for adding/editing expenses)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      formData: { ...prevState.formData, [name]: value },
    }));
  };

  // Handle form submission (add/edit expense)
  const handleSubmit = async (e) => {
    console.log("handle submit function called bhai");
    e.preventDefault();
    setState((prevState) => ({ ...prevState, error: null, success: null }));

    const formattedData = {
      amount: parseFloat(state.formData.amount),
      category: state.formData.category,
      description: state.formData.description,
      date: state.formData.date,
    };

    try {
      let res;
      if (state.editMode) {
        console.log("updating expense request:");
        res = await fetch(`http://localhost:5000/api/expenses/${state.editExpenseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formattedData),
        });
      } else {
        console.log("adding expense request:");
        res = await fetch("http://localhost:5000/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formattedData),
        });
      }

      const data = await res.json();
      console.log("ye rha response: " + JSON.stringify(data));
      if (!res.ok) throw new Error(data.msg || "Failed to add/update expense");
      setState((prevState) => ({
        ...prevState,
        success: state.editMode ? "Expense updated successfully" : "Expense added successfully",
        formData: {
          amount: "",
          category: "",
          description: "",
          date: formattedData.date,
        },
        editMode: false,
        editExpenseId: null,
      }));

      fetchExpenses();
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err.message || "Failed to add/update expense",
      }));
    }
  };

  // Handle expense deletion
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to delete expense");

      setState((prevState) => {
        const updatedExpenses = prevState.expenses.filter((expense) => expense._id !== id);
        const updatedFilteredExpenses = prevState.filteredExpenses.filter((expense) => expense._id !== id);
        return {
          ...prevState,
          expenses: updatedExpenses,
          filteredExpenses: updatedFilteredExpenses,
          success: "Expense deleted successfully",
        };
      });
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: "Failed to delete expense",
      }));
    }
  };

  // Handle editing an expense
  const handleEdit = (expense) => {
    setState((prevState) => ({
      ...prevState,
      formData: {
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
      },
      editMode: true,
      editExpenseId: expense._id,
    }));
  };

  const filteredExpenses = useMemo(
    () => state.filteredExpenses,
    [state.filteredExpenses]
  );

  return (
    <div className="bg-gray-100 min-h-screen">
    
      <main className="p-8">
        {state.error && (
          <div className="text-red-600 bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p>{state.error}</p>
          </div>
        )}
        {state.success && (
          <div className="text-green-600 bg-green-100 border-l-4 border-green-500 p-4 mb-6">
            <p>{state.success}</p>
          </div>
        )}

        {/* Toggle Buttons for Add Expense, Bulk Upload, and Filter */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddExpense(!showAddExpense);
              setShowFilter(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            {showAddExpense ? "Close Add Expense" : "Add Expense"}
          </button>
          <button
            onClick={() => {
              setShowBulkUpload(!showBulkUpload);
              setShowFilter(false);
            }}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            {showBulkUpload ? "Close Bulk Upload" : "Bulk Upload"}
          </button>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            {showFilter ? "Close Filter" : "Show Filter"}
          </button>
        </div>

        {/* Add Expense Form */}
        {showAddExpense && (
          <AddExpense
            formData={state.formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        )}

        {/* Bulk Upload */}
        {showBulkUpload && (
          <div className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h3 className="text-xl mb-4">Bulk Upload Expenses</h3>
            <input type="file" onChange={handleBulkFileChange} className="mb-4" />
            <button
              onClick={handleBulkUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>
        )}

        {/* Expense Filter */}
        {showFilter && (
          <FilterExpenses
            filterData={state.filterData}
            handleFilterChange={handleFilterChange}
            applyFilter={applyFilter}
          />
        )}

        {/* Expense List */}
        <ExpenseList expenses={filteredExpenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </main>
    </div>
  );
};

export default Dashboard;
