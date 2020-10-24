const debug = require('debug')('app:express');
const joi = require('joi');
const Product = require('../models/product');
const searchOptions = require('../lib/searchOptions');

exports.getAll = async (req, res) => {
    debug('get All Products');

    const options = searchOptions(req);
    const allProducts = await Product.find({})
        .skip(options.page - 1)
        .limit(options.limit)
        .sort(options.sort)
        .populate({
            path: 'vendor', 
            select: 'name username'
        });
        
    res.json(allProducts);
}

exports.getOne = async (req, res) => {
    debug('Get One Product');

    const id = req.params.id;
    const product = await Product.findById(id)
        .populate({
            path: 'vendor',
            select: 'name username'
        });

    if (!product) {
        res.status(404).json({
            message: 'Product not found.'
        });
        return;
    }

    res.json(product);
}

exports.create = async (req, res, next) => {
    debug('Create Product');

    const { error } = joi.validate(req.body, {
        name: joi.string().required(),
        price: joi.number().required(),
        description: joi.string().required()
    });

    if (error) return next(error);

    const newProduct = await Product.create({
        ...req.body,
        vendor: req.user.id
    });

    res.json(newProduct);
}

exports.update = async (req, res, next) => {
    debug('Update Product');

    const { error } = joi.validate(req.body, {
        name: joi.string(),
        price: joi.number(),
        description: joi.string()
    });

    if (error) return next(error);

    const id = req.params.id;
    await Product.findByIdAndUpdate(id, req.body);

    const updatedProduct = await Product.findById(id);
    res.json(updatedProduct);
}

exports.delete = async (req, res) => {
    debug('Delete Product');

    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.status(204).end();
}
