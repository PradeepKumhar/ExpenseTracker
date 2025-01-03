import React, { useState } from 'react';
import { exportToCSV, exportToPDF } from '../../utils/exportFunctions';
import ExpensePieChart from '../../utils/chart'; // Import the Pie chart component
import { formatDate } from '../../utils/formateDate';

const ExpenseList = ({ expenses, handleEdit, handleDelete }) => {
    const [isCategoryVisible, setIsCategoryVisible] = useState(false);
    const [isGraphVisible, setIsGraphVisible] = useState(false);  // New state for graph visibility

    const toggleCategoryVisibility = () => {
        setIsCategoryVisible(!isCategoryVisible);
    };

    const toggleGraphVisibility = () => {
        setIsGraphVisible(!isGraphVisible);  // Toggle graph visibility
    };


    // Aggregate data and calculate stats in a single reduce
    const stats = expenses.reduce((acc, expense) => {
        acc.total += expense.amount;
        acc.categories[expense.category] = (acc.categories[expense.category] || 0) + expense.amount;

        if (!acc.highest || expense.amount > acc.highest.amount) acc.highest = expense;
        if (!acc.lowest || expense.amount < acc.lowest.amount) acc.lowest = expense;

        return acc;
    }, { total: 0, categories: {}, highest: null, lowest: null });

    const { total: totalAmount, categories: categoryTotals, highest: highestExpense, lowest: lowestExpense } = stats;
    const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

    const headers = ["Amount", "Category", "Description", "Date"];

    const handleCSVExport = () => {
        exportToCSV(expenses, headers);
    };

    const handlePDFExport = () => {
        const formattedExpenses = expenses.map(expense => ({
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: formatDate(expense.date),
        }));
        exportToPDF(formattedExpenses);
    };

    return (
        <div className="mb-8 space-y-6 p-6 bg-white rounded-lg shadow-md">
            <div className="flex space-x-4 mb-4">
                <button onClick={handleCSVExport} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    Export to CSV
                </button>
                <button onClick={handlePDFExport} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                    Export to PDF
                </button>
            </div>

            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Expense Summary</h4>

            <div className="grid grid-cols-2 gap-6">
                <div className="text-lg font-medium text-gray-700">
                    <div>Total Expenses:</div>
                    <div className="text-xl font-semibold text-gray-900">{totalAmount.toFixed(2)}</div>
                </div>
                <div className="text-lg font-medium text-gray-700">
                    <div>Average Expense:</div>
                    <div className="text-xl font-semibold text-gray-900">{averageAmount.toFixed(2)}</div>
                </div>

                <div className="col-span-2">
                    <button onClick={toggleCategoryVisibility} className="text-blue-600 hover:underline mb-2">
                        {isCategoryVisible ? 'Hide Expenses by Category' : 'Show Expenses by Category'}
                    </button>
                    {isCategoryVisible && (
                        <ul className="list-disc ml-6 space-y-1">
                            {Object.keys(categoryTotals).map(category => (
                                <li key={category} className="flex justify-between text-gray-700">
                                    <span>{category}</span>
                                    <span className="font-semibold">{categoryTotals[category].toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="text-lg font-medium text-gray-700">
                    {highestExpense && (
                        <div className="p-4 bg-green-100 rounded-md text-green-800">
                            <p className="font-semibold">Highest Expense:</p>
                            <p>{highestExpense.description} - <span className="font-bold">{highestExpense.amount.toFixed(2)}</span></p>
                        </div>
                    )}
                </div>

                <div className="text-lg font-medium text-gray-700">
                    {lowestExpense && (
                        <div className="p-4 bg-red-100 rounded-md text-red-800">
                            <p className="font-semibold">Lowest Expense:</p>
                            <p>{lowestExpense.description} - <span className="font-bold">{lowestExpense.amount.toFixed(2)}</span></p>
                        </div>
                    )}
                </div>
            </div>

            {/* Button to toggle graph visibility */}
            <button 
                onClick={toggleGraphVisibility}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mb-4"
            >
                {isGraphVisible ? 'Hide Expense Graph' : 'Show Expense Graph'}
            </button>

            {/* Conditionally render the Pie Chart */}
            {isGraphVisible && <ExpensePieChart  expenses={expenses} />}

            {expenses.length === 0 ? (
                <p className="text-center text-gray-500">No expenses available</p>
            ) : (
                <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-md">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4">{expense.amount.toFixed(2)}</td>
                                    <td className="p-4">{expense.category}</td>
                                    <td className="p-4">{expense.description}</td>
                                    <td className="p-4">{formatDate(expense.date)}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(expense)}
                                                className="bg-blue-600 rounded-md text-white px-4 py-1 hover:bg-blue-700 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(expense._id)}
                                                className="bg-red-600 rounded-md text-white px-4 py-1 hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
