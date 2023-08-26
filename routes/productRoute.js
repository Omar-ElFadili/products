const productController = require('../controllers/productController')
const express = require('express')
const router = express.Router()

router.get('/', productController.findAllProducts);
router.get('/:id', productController.findOneProduct);
router.post('/', productController.createProduct);
router.put('/:id', productController.modifyProduct);
router.delete('/:id', productController.deleteOneProduct);

module.exports = router;

