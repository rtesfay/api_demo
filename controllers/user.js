const debug = require('debug')('app:express')
const joi = require('joi')
const User = require('../models/user')

exports.login = async (req, res, next) => {
    debug('Login');

    const { error } = joi.validate(req.body, {
      username: joi.string().min(4).required(),
      password: joi.string().min(8).required()
    });

    if (error) return next(error);

    const { username, password } = req.body;
    let user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(401).json({
      status: false,
      message: 'Invalid Credentials.'
    });

    const passwordVerified = await user.passwordVerified(password);
    if (!passwordVerified) {
      return res.status(401).json({
        status: false,
        message: "Invalid Credentials."
      });
    }

    res.status(200).json({
      status: true,
      token: user.generateAuthToken()
    });
}
