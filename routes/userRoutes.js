import express from 'express';
import passport from 'passport';
import {
  tokenVerification,
  ensureAuthenticated,
} from '../utils/verifyToken.js';

import {
  createUser,
  // editUser,
  userLogin,
  verifyUser,
  userLogout,
  forgotPassword,
  resetPassword,
  // googleLogin,
  facebookLogin,
} from '../controllers/userController.js';

const router = express.Router();



router.post('/createUser', createUser);
// router.post('/editUser/:id', editUser);
router.post('/userLogin', userLogin);
// router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.get('/userLogout', userLogout);
router.get('/:id/confirm/:token', verifyUser);
router.post('/forgotPassword', forgotPassword);
router.post('/reset-password/:id/:token', resetPassword);

export default router;
