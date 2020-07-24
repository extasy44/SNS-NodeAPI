const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists)
    return res.status(403).json({
      error: 'Email is taken, please use other email address'
    });

  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: 'Signup success! Please login' });
};

exports.signin = async (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with email does not exist!'
      });
    }

    // if user is found make sure the email and password match
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password do not match'
      });
    }

    // generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // persist the token as 't' in cookie with expiry date
    res.cookie('t', { expire: new Date() + 999 });

    // return response with user and token to frontend client
    const { _id, name, email } = user;

    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  return res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
  //if token is valid, express jwt appends the verified userId in an auth key to the request object
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['HS256']
});

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id === req.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized to perform this action'
    });
  }
};
