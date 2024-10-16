// src/PaymentForm.js
import React, { useState } from 'react';

const PaymentForm = () => {
  const [amount, setAmount] = useState(); // Default amount $50

  const handlePayment = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency: 'INR' }), // Specify the currency
    });

    const orderData = await response.json();
    const { id: orderId } = orderData;

    // Initiate Razorpay payment
    const options = {
      key: 'rzp_test_DTuJNXNxcaHEqZ', // Replace with your Razorpay key ID
      amount: amount * 100, // Amount is in paisa
      currency: 'INR',
      name: 'Abhishek company',
      description: 'Test Transaction',
      order_id: orderId,
      handler: function (response) {
        alert(`Payment Successful: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div>
      <h2>Razorpay Payment</h2>
      <form onSubmit={handlePayment}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          placeholder="Enter amount in INR"
          required
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentForm;
