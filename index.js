import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import passportGoogleStrategy from './passport.js';
import passportFacebookStrategy from './controllers/auth/facebookAuth.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

import productRoutes from './routes/productRoute.js';
import userRoutes from './routes/userRoutes.js';
import stripe from './routes/stripe.js';

import DBConfig from './config/DBConfig.js';

DBConfig;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    name: 'session',
    // cookie: { secure: true },
    // httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// app.use(cors('*'));
app.use(
  cors({
    origin: 'https://ecommercefrontend-bhvl.onrender.com/',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.json({
    message,
    statusCode,
    success: false,
  });
});

passportFacebookStrategy(passport);
passportGoogleStrategy(passport);

app.use('/api/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stripe', stripe);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
