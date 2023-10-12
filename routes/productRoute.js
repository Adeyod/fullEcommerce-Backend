import express from 'express';
import upload from '../utils/multer.js';
import cloudinary from '../utils/cloudinary.js';
import {
  getAllProducts,
  getProductById,
  addProduct,
  editProduct,
  deleteProductById,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/getProductById/:id', getProductById);
router.put('/editProduct/:id', editProduct);
router.delete('/deleteProductById/:id', deleteProductById);
router.post('/addProduct', addProduct);

export default router;
