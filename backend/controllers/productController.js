const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    
    let query = { isAvailable: true };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('seller', 'name email college avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching products' 
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone college avatar');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching product' 
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Seller only)
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition, image, stock, tags } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      image,
      stock,
      tags,
      seller: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating product' 
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this product' 
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating product' 
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this product' 
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting product' 
    });
  }
};

// @desc    Get user's products (seller's listings)
// @route   GET /api/products/my-products
// @access  Private
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get My Products Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching your products' 
    });
  }
};
