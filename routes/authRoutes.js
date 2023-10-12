import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/userModel.js';
import { generateToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/login/success', (req, res) => {
  if (req.user) {
    // console.log(req.user);
    res.status(200).json({
      message: 'Social media login successful',
      success: true,
      // user: req.user,
      user: req.user,
      cookies: req.cookies,
    });
  }
});

router.get('/login/failed', (req, res) => {
  res.json({
    status: 401,
    success: false,
    message: 'failure',
  });
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  })
  // passport.authenticate('google', { scope: ['openid', 'email', 'profile'] })
  // passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'process.env.BASE_URL',
    failureRedirect: '/login/failed',
  })
);

// router.get(
//   '/auth/facebook',
//   passport.authenticate('facebook', { scope: 'email' })
// );
// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: 'http://localhost:5174/',
//     failureRedirect: 'http://localhost:5174/login',
//   })
// );

export default router;
