import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../../models/userModel.js';
import { generateToken } from '../../utils/verifyToken.js';

import dotenv from 'dotenv';
dotenv.config();

const passportFacebookStrategy = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:3030/auth/facebook/callback',
        profileField: ['id', 'emails', 'displayName', 'name', 'picture'],
      },

      async function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        // console.log(emails);
        // console.log(profile.emails[0].value);
        // try {
        //   let user = await User.findOne({ providerId: profile.id });
        //   if (user) {
        //     return cb(null, user);
        //   } else {
        //     const generatedPassword =
        //       profile.name.familyName +
        //       profile.name.givenName +
        //       Math.random().toString(32).slice(-8);
        //     const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
        //     const newUser = await new User({
        //       firstName: profile.name.givenName,
        //       lastName: profile.name.familyName,
        //       email: 'adeexample@gmail.com',
        //       password: hashedPassword,
        //       // profilePicture: profile.photos[0].value,
        //       provider: profile.provider,
        //       providerId: profile.id,
        //       verified: true,
        //     });
        //     user = await newUser.save();
        //     return cb(null, user);
        //   }
        // } catch (error) {
        //   console.log(error);
        // }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    return done(null, user);
    // done(null, user.id);
  });

  passport.deserializeUser(function (user, done) {
    // User.findById(id).then((user) => {
    //   done(null, user);
    // })

    return done(null, user);
  });
};

export default passportFacebookStrategy;
