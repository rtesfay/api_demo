const mongoose = require('mongoose');
const cartItem = require('./cartItem');

const cartSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cartItems: [cartItem.schema]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Cart', cartSchema);