import errorHandler from '../middlewares/errorHandler.js';
import Product from '../models/productModel.js';
import cloudinary from '../utils/cloudinary.js';
import upload from '../utils/multer.js';

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      products,
      message: 'products fetched successfully',
      status: 200,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: 'Internal server error',
    });
  }
};
const getProductById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);
    res.json({
      product,
      message: 'product fetched successfully',
      status: 200,
    });
  } catch (error) {
    next(errorHandler(304, 'Can not fetch product with the id'));
    // next(error, 'Incorrect id');
  }
};
const addProduct = async (req, res) => {
  const { formData, images } = req.body;
  const {
    title,
    category,
    brand,
    description,
    // discountPercentage,
    price,
    stock,
  } = formData;
  // console.log(formData);
  // console.log(images);

  // UPLOAD IMAGE TO CLOUDINARY HERE

  try {
    // if (images) {
    // const uploadRes = await cloudinary.uploader.upload(images, {
    //   upload_preset: 'myEcommerce',
    // });
    // console.log(uploadRes);
    // if (uploadRes) {
    const newProduct = await new Product({
      title,
      category,
      brand,
      description,
      // discountPercentage,
      price,
      stock,
      images,
    });
    const product = await newProduct.save();
    // console.log('product:', product);
    res.json({
      product,
      message: 'Product created successfully',
      status: 200,
    });
    return;
    // }
    // }
  } catch (error) {
    console.log(error);
  }
};
const editProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);

    res.json({
      message: 'product updated successfully',
      status: 200,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};
const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({
      message: 'product deleted successfully',
      status: 200,
    });
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export {
  getAllProducts,
  deleteProductById,
  editProduct,
  addProduct,
  getProductById,
};
