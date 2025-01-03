// src/components/FilterExpenses.js
import React from 'react';

const FilterExpenses = ({ filterData, onFilterChange, onApplyFilter }) => {
   return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
         <h3 className="text-xl font-semibold text-gray-700 mb-6">Filter Expenses</h3>
         <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
               <label htmlFor="categoryFilter" className="block text-gray-600 mb-2">Category</label>
               <input
                  type="text"
                  id="categoryFilter"
                  name="categoryFilter"
                  placeholder="Category"
                  value={filterData.categoryFilter}
                  onChange={onFilterChange}
                  className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
               />
            </div>
            <div>
               <label htmlFor="startDate" className="block text-gray-600 mb-2">Start Date</label>
               <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filterData.startDate}
                  onChange={onFilterChange}
                  className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
               />
            </div>
            <div>
               <label htmlFor="endDate" className="block text-gray-600 mb-2">End Date</label>
               <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filterData.endDate}
                  onChange={onFilterChange}
                  className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
               />
            </div>
            <div>
               <label htmlFor="minAmount" className="block text-gray-600 mb-2">Min Amount</label>
               <input
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  placeholder="Min Amount"
                  value={filterData.minAmount}
                  onChange={onFilterChange}
                  className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
               />
            </div>
            <div>
               <label htmlFor="maxAmount" className="block text-gray-600 mb-2">Max Amount</label>
               <input
                  type="number"
                  id="maxAmount"
                  name="maxAmount"
                  placeholder="Max Amount"
                  value={filterData.maxAmount}
                  onChange={onFilterChange}
                  className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
               />
            </div>
            <div>
               <label htmlFor="sortBy" className="block text-gray-600 mb-2">Sort By</label>
               <select
                  id="sortBy"
                  name="sortBy"
                  value={filterData.sortBy}
                  onChange={onFilterChange}
                  className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
               >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
               </select>
            </div>
            <div>
               <label htmlFor="sortOrder" className="block text-gray-600 mb-2">Sort Order</label>
               <select
                  id="sortOrder"
                  name="sortOrder"
                  value={filterData.sortOrder}
                  onChange={onFilterChange}
                  className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
               >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
               </select>
            </div>
            <div className="sm:col-span-2">
               <button
                  type="button"
                  onClick={onApplyFilter}
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Apply Filter
               </button>
            </div>
         </form>
      </div>
   );
};

export default FilterExpenses;
