const asyncHandler = require("express-async-handler");
const ObjectId = require("mongoose").Types.ObjectId;
const Fuse = require("fuse.js");
const Product = require("../models/ProductModel");

const getProducts = asyncHandler(async (req, res) => {
  try {
    const { page: pageFromParams, productsPerPage = 10, search } = req.query;

    const page = +pageFromParams >= 1 ? +pageFromParams - 1 : 0;
    const MAX_PRODUCTS_PER_PAGE = 50;

    const limit = Math.min(+productsPerPage, MAX_PRODUCTS_PER_PAGE);

    const searchFilter = search
      ? {
          title: { $regex: new RegExp(`\\b${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), $options: "i" },
        }
      : {};

    // Fetch filtered and paginated products
    const products = await Product.find(searchFilter)
      .sort({ _id: "asc" }) // Sort by a unique field (_id in this case)
      .limit(limit)
      .skip(limit * page)
      .select("-comments -specifications -createdAt -updatedAt -images -description -brand -category"); // Exclude unnecessary fields

    // Count total products matching the filter
    const total = await Product.countDocuments(searchFilter);

    // Return results with success status even if no products are found
    res.json({
      result: products,
      page,
      productsPerPage: limit,
      total,
      pages: total < limit ? 1 : Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getMultipleProducts = asyncHandler(async (req, res) => {
  const { productIds } = req.query;

  if (Array.isArray(productIds) || ObjectId.isValid(productIds)) {
    const query = { _id: { $in: productIds } };
    const products = await Product.find(query).sort({ createdAt: "desc" }).select("-id");

    const total = await Product.find(query).countDocuments();

    if (products.length) {
      res.json({
        result: products,
        total,
      });
    } else {
      res.status(200).json({ result: [], total: 0, message: "No products found" });
    }
  } else {
    res.status(400).json({ result: [], total: 0, message: "Query param for products is malformed" });
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product doesn't exist" });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { title, description, price, discountPercentage, stock, brand, category } = req.body;

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      title,
      description,
      price,
      discountPercentage,
      stock,
      brand,
      category,
    },
    { new: true },
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product doesn't exist" });
  }
});

const addCommentToProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { comment, rating, reviewerName, reviewerEmail } = req.body;

  if (!comment || !rating || !reviewerName || !reviewerEmail) {
    res.status(400).json({ message: "All fields are required for adding a comment" });
    return;
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404).json({ message: "Product doesn't exist" });
    return;
  }

  // Add the new comment to the product's comments array
  const newComment = {
    comment,
    rating,
    reviewerName,
    reviewerEmail,
    date: new Date(),
  };

  product.comments = product.comments || [];
  product.comments.push(newComment);

  await product.save();

  res.status(200).json({ message: "Comment added successfully", product });
});

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, discountPercentage, stock, brand, category } = req.body;

  if (!title || !description || !price || !brand || !category) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }

  const product = await Product.create({
    title,
    description,
    price,
    discountPercentage,
    stock,
    brand,
    category,
  });

  if (product) {
    res.status(200).json({
      message: "Product was created successfully",
      product,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

module.exports = {
  getMultipleProducts,
  updateProduct,
  getProducts,
  getProduct,
  createProduct,
  addCommentToProduct,
};
