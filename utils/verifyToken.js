import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = async (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '5h',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 5 * 1000,
  });
};

const tokenVerification = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'You need to login'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Token is invalid'));
    req.user = user;
    next();
  });
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // User is authenticated, continue with the request
    return next();
  }
  // User is not authenticated, redirect them to the login page or handle as needed
  res.redirect('/login');
}

export { generateToken, tokenVerification, ensureAuthenticated };
