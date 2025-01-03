import React, { useState } from 'react';

const Calculator = () => {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [results, setResults] = useState([]);
  const [balances, setBalances] = useState({});

  const [memberName, setMemberName] = useState('');
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');

  const addMember = () => {
    if (memberName.trim() && !members.includes(memberName)) {
      setMembers([...members, memberName]);
      setBalances({ ...balances, [memberName]: 0 }); // Initialize balance for the new member
      setMemberName('');
    }
  };

  const addExpense = () => {
    if (payer && amount > 0) {
      // Update the expense list
      setExpenses([...expenses, { payer, amount: parseFloat(amount) }]);
      // Update the balance of the payer directly
      setBalances(prevBalances => ({
        ...prevBalances,
        [payer]: prevBalances[payer] + parseFloat(amount)
      }));
      setPayer('');
      setAmount('');
    }
  };

  const calculateBalances = () => {
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const share = totalExpense / members.length;

    // Initialize balance for each member, starting from the negative share
    let newBalances = members.reduce((acc, member) => {
      acc[member] = -share;
      return acc;
    }, {});

    // Update balances based on expenses (each payer's balance increases by their expense)
    expenses.forEach(({ payer, amount }) => {
      newBalances[payer] += amount;
    });

    // Set the updated balances state
    setBalances(newBalances);

    const creditors = [];
    const debtors = [];
    Object.entries(newBalances).forEach(([member, balance]) => {
      if (balance > 0) creditors.push({ member, balance });
      else if (balance < 0) debtors.push({ member, balance: Math.abs(balance) });
    });

    const transactions = [];
    while (creditors.length && debtors.length) {
      const creditor = creditors[0];
      const debtor = debtors[0];

      const payment = Math.min(creditor.balance, debtor.balance);

      transactions.push({
        from: debtor.member,
        to: creditor.member,
        amount: payment.toFixed(2),
      });

      creditor.balance -= payment;
      debtor.balance -= payment;

      if (creditor.balance === 0) creditors.shift();
      if (debtor.balance === 0) debtors.shift();
    }

    setResults(transactions);
  };

  const reset = () => {
    setMembers([]);
    setExpenses([]);
    setResults([]);
    setBalances({});
    setMemberName('');
    setPayer('');
    setAmount('');
  };

  return (
    <div className="max-w-6xl  mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-6">Group Expense Calculator</h2>

      {/* Add Members Section */}
      <section className="mb-8">
        <h3 className="text-xl font-medium text-gray-800 mb-3">Add Members</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Enter member name"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addMember}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none transition"
          >
            Add Member
          </button>
        </div>
      </section>

      {/* Record Expenses Section */}
      <section className="mb-8">
        <h3 className="text-xl font-medium text-gray-800 mb-3">Record Expenses</h3>
        <div className="flex items-center space-x-4 mb-4">
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Payer</option>
            {members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addExpense}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none transition"
          >
            Add Expense
          </button>
        </div>
      </section>

      {/* Members and Balances Section */}
      <section className="mb-8">
        <h3 className="text-xl font-medium text-gray-800 mb-3">Members and Balances</h3>
        <div className="h-40 overflow-y-auto bg-gray-50 p-4 rounded-md border border-gray-200">
          <ul className="list-disc list-inside text-gray-700">
            {members.length > 0 ? (
              members.map((member) => (
                <li key={member} className="mb-2">
                  {member}: <span className={balances[member] > 0 ? 'text-green-500' : 'text-red-500'}>
                    {balances[member].toFixed(2)}
                  </span>
                </li>
              ))
            ) : (
              <li>No members added yet.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Results Section */}
      <section>
        <h3 className="text-xl font-medium text-gray-800 mb-3">Results</h3>
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={calculateBalances}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 focus:outline-none transition"
          >
            Calculate
          </button>
          <button
            onClick={reset}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none transition"
          >
            Reset
          </button>
        </div>
        <ul className="list-disc list-inside text-gray-700">
          {results.length > 0 ? (
            results.map(({ from, to, amount }, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold text-blue-700">{from}</span> should pay{' '}
                <span className="font-semibold text-blue-700">{to}</span> an amount of{' '}
                <span className="font-semibold text-blue-700">{amount}</span>.
              </li>
            ))
          ) : (
            <li>No transactions needed. All balances are settled.</li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Calculator;
