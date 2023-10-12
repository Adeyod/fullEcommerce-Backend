import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
import Order from '../models/order.js';
import User from '../models/userModel.js';

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  // console.log('what i want to destructure:', req.body.cartItems);

  // console.log('what i want to destructure:', others._id);
  // console.log(JSON.stringify(req.body.cartItems.toString()));
  const { cartItems, userId } = req.body;
  console.log(cartItems);
  const Test = cartItems.map((singleItem) => {
    return {
      id: singleItem._id,
      title: singleItem.title,
      brand: singleItem.brand,
      // createdAt: singleItem.createdAt,
      // updatedAt: singleItem.updatedAt,
      quantity: singleItem.quantity,
      // images: singleItem.images,
    };
  });

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      cart: JSON.stringify(Test),
    },
  });
  // console.log(customer.metadata);
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.images[0]],
          description: item.description,

          metadata: {
            id: item._id,
          },
        },

        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });
  // console.log(line_items);
  // return;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'NG'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Next day air',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items,
    mode: 'payment',
    success_url: `${process.env.BASE_URL}/checkout-success`,
    cancel_url: `${process.env.BASE_URL}/cart`,
  });

  res.send({ url: session.url });
});

// CREATE ORDER
const createOrder = async (customer, data) => {
  // const Items = JSON.parse(customer.metadata.Test);
  const Items = JSON.parse(customer.metadata.cart);
  console.log('Items:', Items);

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer.id,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: Items,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });
  try {
    const savedOrder = await newOrder.save();
    console.log('Processed Order:', savedOrder);
    // SEND EMAIL TO USER HERE
  } catch (error) {
    console.log(error);
  }
};

// STRIPE WEBHOOK

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    // VERIFY THAT EVENT CALLING THE HOOK COMES FROM STRIPE
    const sig = req.headers['stripe-signature'];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        // console.log('Webhook verified...');
      } catch (err) {
        // console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === 'checkout.session.completed') {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrder(customer, data);
          // console.log('data:', data);
          // console.log('customer:', customer);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    // Return a 200 res to acknowledge receipt of the event
    res.status(200).send({ message: 'payment successful' }).end();
  }
);

export default router;
