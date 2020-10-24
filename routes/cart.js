const express = require('express');
const router = express.Router();
const cart = require('../controllers/cart');

router.get('/items', cart.getItems);
router.post('/add', cart.addToCart);
router.delete('/remove/:id', cart.removeFromCart);

module.exports = router;