import React from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const ExpenseGraphs = ({ expenses }) => {
    

    // Aggregating amounts by category for the pie chart
    const categoryTotals = expenses.reduce((acc, { amount, category }) => {
        acc[category] = acc[category] ? acc[category] + amount : amount;
        return acc;
    }, {});

    // Preparing the data for Pie chart (Expenses by Category)
    const pieChartData = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40',
                    '#9966FF', '#FF6699', '#66FF66', '#FF3366', '#FF9900'
                ],
                hoverOffset: 4,
            },
        ],
    };

    // Preparing data for Line chart (Expenses over Time)
    const timeData = expenses.reduce((acc, { amount, date }) => {
        const dateKey = new Date(date).toLocaleDateString(); // Get the date in a readable format
        acc[dateKey] = acc[dateKey] ? acc[dateKey] + amount : amount;
        return acc;
    }, {});

    const lineChartData = {
        labels: Object.keys(timeData),
        datasets: [
            {
                label: 'Expenses Over Time',
                data: Object.values(timeData),
                fill: false,
                borderColor: '#36A2EB',
                tension: 0.1,
            },
        ],
    };

    // Preparing data for Bar chart (Total Expense vs. Income)
    const income = 5000;  // Example static income for demonstration
    const barChartData = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                label: 'Expenses',
                data: Object.values(categoryTotals),
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                borderWidth: 1,
            },
            {
                label: 'Income',
                data: Object.keys(categoryTotals).map(() => income),
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Expenses Insights</h4>
            
            {/* Pie Chart: Expenses by Category */}
            <div className="mb-6" style={{ width: '100%', height: '300px' }}>
                <h5 className="text-xl font-medium text-gray-800 mb-2">Expenses by Category</h5>
                <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
            
            {/* Line Chart: Expenses over Time */}
            <div className="mb-6" style={{ width: '100%', height: '300px' }}>
                <h5 className="text-xl font-medium text-gray-800 mb-2">Expenses Over Time</h5>
                <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
            </div>

            {/* Bar Chart: Total Expense vs. Income */}
            <div className="mb-6" style={{ width: '100%', height: '300px' }}>
                <h5 className="text-xl font-medium text-gray-800 mb-2">Expenses vs. Income</h5>
                <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
            </div>
        </div>
    );
};

export default ExpenseGraphs;
