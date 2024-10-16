import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load your Stripe public key
const stripePromise = loadStripe('pk_test_51QAN29FNwyjjpinI7xVdUpl5XvEUE6xaEuXE9YwLT05mEzMsFfmtNwaMrmp8RwatGfp1rmgmkR88IlnocDKvKZ0L00XIktxhQ0'); // Replace with actual public key

// Payment Form Component
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  // Handle card element change to detect and display errors
  const handleCardChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError('');
    }
  };

  // Handle form submission for payment
  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    // Validate that Stripe and Elements are loaded properly
    if (!stripe || !elements) {
      setError('Stripe has not loaded properly.');
      setPaymentProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    // Validate that card element is available and complete
    if (!cardElement || cardElement._complete !== true) {
      setError('Please complete all the card fields.');
      setPaymentProcessing(false);
      return;
    }

    try {
      // Create payment intent on the backend
      const { clientSecret } = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 5000, currency: 'usd' }), // Example: $50.00 USD
      }).then((res) => res.json());

      // Confirm payment with Stripe
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // Customize with customer details
          },
        },
      });

      setPaymentProcessing(false);

      // Handle payment result
      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
        setPaymentSucceeded(true);
        alert('Payment Successful!');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setPaymentProcessing(false);
    }
  };

  return (
    <div>
      <h2>Stripe Payment</h2>
      {paymentSucceeded ? (
        <div>Thank you! Your payment was successful.</div>
      ) : (
        <form onSubmit={handlePayment}>
          <CardElement
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
          <button type="submit" disabled={!stripe || paymentProcessing}>
            {paymentProcessing ? 'Processing...' : 'Pay $50'}
          </button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </form>
      )}
    </div>
  );
};

// Container for Stripe Elements
const StripeContainer = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default StripeContainer;
