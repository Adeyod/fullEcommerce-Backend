import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import passport from 'passport';
import { verifyEmail, passwordReset } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import { generateToken, tokenVerification } from '../utils/verifyToken.js';
import errorHandler from '../middlewares/errorHandler.js';

// user registration
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, profilePicture } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      res.json({
        message: 'User already exist',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture,
    });
    user = await newUser.save();

    // const { password: hashedPassword2, ...others } = user._doc;

    // generate verification token
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
    await token.save();

    // send mail
    const link = `${process.env.BASE_URL}/users/${user._id}/confirm/${token.token}`;
    // const link = `http://localhost:5174/${user._id}/confirm/${token.token}`;
    // const link = `http://localhost:5174/api/users/${user._id}/confirm/${token.token}`;
    // const link = `http://localhost:3030/api/users/${user._id}/confirm/${token.token}`;
    await verifyEmail(user.email, link);
    res.json({
      status: 200,
      link,
      message: 'Verification mail sent, check your mail...',
    });
    // res.json({
    //   others,
    //   message: 'user registration is successful, you can login',
    //   success: true,
    //   status: 200,
    // });
  } catch (error) {
    next(error);
    return;
  }
};

// email verification to verify users
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    // const user = await User.findById({ _id: req.params.id });

    if (!user) {
      return res.json({
        status: 400,
        message: 'Invalid Link',
      });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      res.json({
        status: 400,
        message: 'Invalid link',
      });
      return;
    }

    await User.updateOne({ _id: token.userId }, { $set: { verified: true } });
    await Token.findByIdAndRemove(token);
    res.json({
      message: 'email verified successfully, you can login...',
      status: 200,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

// user login
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      res.json({
        status: 400,
        message: 'Invalid login details',
      });
      return;
    }

    let validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.json({
        status: 400,
        message: 'Invalid login details',
      });
      return;
    }

    if (user.verified === false) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex'),
        });
        await token.save();

        const link = `${process.env.BASE_URL}/users/${user._id}/confirm/${token.token}`;

        // const link = `http://localhost:3030/api/users/${user._id}/confirm/${token.token}`;
        await verifyEmail(user.email, link);
        res.json({
          status: 200,
          success: false,
          message: 'Verification email has been sent to your email',
        });
        return;
      }
      res.json({
        status: 400,
        success: false,
        message: 'Email sent to your account, Verify',
      });
      return;
    }

    const { password: hashedPassword, ...others } = user._doc;

    generateToken(res, user._id);
    res.json({
      others,
      status: 200,
      success: true,
      message: `login is successful`,
      // message: `${others.firstName} your login is successful`,
    });
    return;
  } catch (error) {
    res.json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
    });
    return;
  }
};
const userLogout = async (req, res, next) => {
  // res.clearCookie('jwt').json({
  //   status: 200,
  //   message: 'User logout successful',
  //   success: true,
  // });
  req.logout((error) => {
    if (error) {
      return next(errorHandler(304, 'Something went wrong'));
    }
    // res.clearCookie('session');
    // res.clearCookie('jwt');
    // res.json({
    //   status: 200,
    //   message: 'User logout successful',
    //   success: true,
    // });

    res.clearCookie('session');
    res.clearCookie('jwt');
    res.json({
      status: 200,
      message: 'User logout successful',
      success: true,
    });
  });

  // req.session.destroy((err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.destroy('session');
  //   res.clearCookie('jwt');
  //   res.json({
  //     status: 200,
  //     message: 'User logout successful',
  //     success: true,
  //   });
  // });
};
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        status: 400,
        message: 'User not found',
      });
    } else {
      const generatedToken = crypto.randomBytes(64).toString('hex');
      const token = jwt.sign(
        {
          id: user._id,
          extra: generatedToken,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      user.resetToken = token;
      await user.save();

      // password reset link to be sent to user
      const link = `${process.env.BASE_URL}/reset-password/${user._id}/${token}`;

      passwordReset(user.email, link);
      res.json({
        status: 200,
        success: true,
        message: 'Check your email to change your password...',
      });
    }
  } catch (error) {
    return res.json({ status: 400, message: 'Internal Error' });
  }
};
const resetPassword = async (req, res, next) => {
  const { id, token } = req.params;

  const { oldPassword, newPassword } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.json({
        status: 401,
        message: 'Invalid Token',
      });
    } else {
      const user = await User.findOne({ resetToken: token });
      if (user) {
        const validOldPassword = bcrypt.compareSync(oldPassword, user.password);
        if (!validOldPassword) {
          res.json({
            status: 400,
            success: false,
            message: 'Wrong credential',
          });
          return;
        } else {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          const newUserPass = await User.findByIdAndUpdate(
            {
              _id: id,
            },
            { password: hashedPassword, $set: { resetToken: '' } }
          );

          const saveNewUser = await newUserPass.save();

          res.json({
            status: 200,
            success: true,
            saveNewUser,
            message: 'Password changed successfully. You can login...',
          });
          return;
        }
      }
      // const validOldPassword = bcrypt.compareSync(oldPassword, user.password);
      // if (!validOldPassword) {
      // res.json({
      //   status: 400,
      //   success: false,
      //   message: 'Wrong credential',
      // });
      return;
      // }
      // else{
      // const hashedPassword = await bcrypt.hash(newPassword, 10);

      // const newUserPass = await User.updateOne(
      //   {
      //     _id: id,
      //   },
      //   { password: hashedPassword, $set: { resetToken: '' } }
      // );

      // const saveNewUser = await newUserPass.save();
      // res.json({
      //   status: 200,
      //   success: true,
      //   saveNewUser,
      //   message: 'Password changed successfully. You can login...',
      // });
      // console.log('success', res.json);
      // return;
    }
    // } catch (error) {

    // }
  });
};
// const editUser = async (req, res, next) => {
//   const { id } = req.params;
//   if (req.user.id !== id) {
//     return res.json({
//       status: 401,
//       message: 'You can only edit your account',
//       success: false,
//     });
//   } else {
//     try {
//       if (req.body.profilePicture) {
//       }
//       const updatedUser = await User.findByIdAndUpdate({
//         $set: {},
//       });
//     } catch (error) {
//       return next(errorHandler(304, 'Something went wrong'));
//     }
//   }
// };
const googleRegister = async (req, res, next) => {};
const facebookRegister = async (req, res, next) => {};
const facebookLogin = async (req, res, next) => {};
const getCurrentUser = async (req, res, next) => {};
const getAllUsers = async (req, res, next) => {};
const updateUserStatus = async (req, res, next) => {};

export {
  // googleLogin,
  googleRegister,
  facebookRegister,
  facebookLogin,
  resetPassword,
  forgotPassword,
  userLogout,
  updateUserStatus,
  verifyUser,
  getAllUsers,
  getCurrentUser,
  userLogin,
  createUser,
};
