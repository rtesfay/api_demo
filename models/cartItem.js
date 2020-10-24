const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

exports.schema = cartItemSchema;
module.exports = mongoose.model('CartItem', cartItemSchema);