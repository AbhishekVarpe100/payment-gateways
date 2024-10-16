// server.js
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_DTuJNXNxcaHEqZ', // Replace with your Razorpay key ID
  key_secret: 'bkZZxnjy19Rji0SeqGYYbHf3', // Replace with your Razorpay key secret
});

// Create a payment order
app.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100, // Amount is in paisa, so multiply by 100
    currency,
    receipt: 'receipt#1',
    payment_capture: 1, // Automatically capture the payment
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
