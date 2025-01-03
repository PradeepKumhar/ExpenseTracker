import React from 'react';
import Calculator from '../utils/Calculator';
import bg from '../assests/images/expenseCalculator.jpg'

const ExpenseCalculator = () => {
  return (
    <div style={{backgroundImage: `url(${bg})`,
       backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}>
      <Calculator/>
    </div>
  );
}

export default ExpenseCalculator;
