import errorHandler from '../middlewares/errorHandler.js';
import Product from '../models/productModel.js';
import cloudinary from '../utils/cloudinary.js';
import upload from '../utils/multer.js';
import cron from 'node-cron';

cron.schedule('0 * * * *', async (req, res) => {
  console.log('API is running');
  try {
    // const response = await fetch('http://localhost:3030/api/products');
    const response = await fetch(
      'https://fullecommerce-backend.onrender.com/api/products'
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`Backend API call successful: ${JSON.stringify(data)}`);
    } else {
      console.error(`Unexpected status code: ${(await response).status}`);
    }
  } catch (error) {
    console.log(error);
  }
});

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
    if (!title || !category || !brand || !description || !price || !stock) {
      return res.json({
        message: 'All fields are required',
        success: false,
        status: 401,
      });
    }

    const trimmedTitle = title.trim();
    const trimmedBrand = brand.trim();
    const trimmedPrice = price.trim();
    const trimmedStock = stock.trim();
    const trimmedDescription = description.trim();

    // check the fields to prevent input of unwanted characters
    if (!/^[a-zA-Z0-9 -]+$/.test(trimmedTitle)) {
      return res.json({
        message: 'Invalid input for title...',
        status: 400,
        success: false,
      });
    }

    if (!/^[a-zA-Z0-9 -]+$/.test(trimmedBrand)) {
      return res.json({
        message: 'Invalid input for brand...',
        status: 400,
        success: false,
      });
    }

    if (!/^[a-zA-Z0-9 -]+$/.test(trimmedPrice)) {
      return res.json({
        message: 'Invalid input for Price...',
        status: 400,
        success: false,
      });
    }

    if (!/^[a-zA-Z0-9 -]+$/.test(trimmedStock)) {
      return res.json({
        message: 'Invalid input for stock...',
        status: 400,
        success: false,
      });
    }

    if (!/^[a-zA-Z0-9 -]+$/.test(trimmedDescription)) {
      return res.json({
        message: 'Invalid input for description...',
        status: 400,
        success: false,
      });
    }

    const product = await newProduct.save();
    res.json({
      product,
      message: 'Product created successfully',
      status: 200,
    });
    return;
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
