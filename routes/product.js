const express = require('express');
const product = require('../controllers/product');
const router = express.Router();

router.get('/', product.getAll);
router.post('/', product.create);
router.get('/:id', product.getOne);
router.patch('/:id', product.update);
router.delete('/:id', product.delete);

module.exports = router;