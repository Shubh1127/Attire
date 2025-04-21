const Product = require('../Model/ProductModel');
const cloudinary = require('../Config/CloudnaryConfig');

module.exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, mainCategory, category, sizes, colors, status, quantity } = req.body;

    // Validate mainCategory is one of the allowed values
    if (!['men', 'women', 'kids'].includes(mainCategory)) {
      return res.status(400).json({ message: "Invalid main category" });
    }

    // Upload photos to Cloudinary
    const photoUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "Products",
        });
        photoUrls.push(result.secure_url);
      }
    }

    if (photoUrls.length < 1) {
      return res.status(400).json({ message: "At least one photo is required." });
    }

    const product = new Product({
      name,
      photo: photoUrls,
      price,
      description,
      mainCategory,
      category,
      sizes: sizes ? sizes.split(",") : [],
      colors: colors ? colors.split(",") : [],
      status,
      quantity,
      OwnerId: req.user._id,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments(); // Count all products in the database
    res.status(200).json({ totalProducts });
  } catch (error) {
    console.error("Error fetching total products:", error);
    res.status(500).json({ message: "Server error" });
  }
};