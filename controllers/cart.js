const debug = require('debug')('app:express');
const joi = require('joi');
const Cart = require('../models/cart');

async function findCartOrCreate(user) {
  let cart = await Cart.findOne({ user: user.id });
  if (!cart) {
    cart = new Cart({ user: user.id, cartItems: [] });
    await cart.save();
  }
  return cart;
}

exports.getItems = async (req, res) => {
    debug('Get Cart Items');
    
    const cart = await findCartOrCreate(req.user);
    await cart.populate('cartItems.product').execPopulate();
    
    res.json(cart.cartItems);
}

exports.addToCart = async (req, res, next) => {
    debug('Add To Cart');

    const { error } = joi.validate(req.body, joi.array().items({
        product: joi.string().required(),
        quantity: joi.number().min(1).required()
    }));

    if (error) return next(error);

    const cart = await findCartOrCreate(req.user);
    const newCartItems = req.body;

    // check if product already exists in cart
    newCartItems.forEach(newCartItem => {
      const [ existingItem ] = cart.cartItems.filter(
        cartItem => newCartItem.product == cartItem.product
      );

      if (existingItem) {
        existingItem.quantity += newCartItem.quantity;
      } else {
        cart.cartItems.push(newCartItem);
      }
    });

    await cart.save();

    res.json(cart.cartItems);
}

exports.removeFromCart = async (req, res, next) => {
    debug('Remove From Cart');

    const cart = await findCartOrCreate(req.user);
    const cartItemId = req.params.id;
    cart.cartItems = cart.cartItems.filter(cartItem => cartItemId != cartItem._id);
    await cart.save();

    res.status(204).end();
}
