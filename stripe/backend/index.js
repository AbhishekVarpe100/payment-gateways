const express=require('express')
const app=express()
const Stripe=require('stripe')
const cors=require('cors')
app.use(cors())

app.use(express.json())


const stripe=Stripe('sk_test_51QAN29FNwyjjpinI1DEPt7AJ0rbdiWZyXMT11kNcHNJyGgGyKR4SEuDYSjSvUIfbrzye93u2ELk2mro7wbCUU2k800sa7pfOaK')



app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });
  
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });

    } catch (error) {
      res.status(500).send({
        error: error.message,
      });
    }
  });






app.listen(3000,()=>{
    console.log("Server is listening on port 3000")
})
