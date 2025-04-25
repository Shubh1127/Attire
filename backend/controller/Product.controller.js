const Product = require('../Model/ProductModel');
const cloudinary = require('../Config/CloudnaryConfig');
const Owner = require('../Model/OwnerModel');
 module.exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, mainCategory, category, sizes, colors, status, quantity } = req.body;
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

    // Create the product
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

    // Update the owner's products array
    await Owner.findByIdAndUpdate(
      req.user._id, // Find the owner by their ID
      { $push: { products: product._id } }, // Push the product's ID into the products array
      { new: true } // Return the updated document
    );

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getOwnerProducts = async (req, res) => {
  try {
    const ownerId = req.user._id; // Get the logged-in user's ID from the auth middleware
    const products = await Product.find({ OwnerId: ownerId }); // Fetch products added by the logged-in user
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    // Update the product with the provided data
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { deleteAllStock, stockToDelete } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (deleteAllStock) {
      // Delete the product entirely
      await Product.findByIdAndDelete(productId);

      // Remove the product from the owner's products array
      await Owner.findByIdAndUpdate(
        product.OwnerId,
        { $pull: { products: productId } }
      );

      return res.status(200).json({ message: "Product deleted successfully" });
    } else if (stockToDelete) {
      // Reduce the stock manually
      if (product.quantity < stockToDelete) {
        return res.status(400).json({ message: "Not enough stock to delete" });
      }

      product.quantity -= stockToDelete;
      await product.save();

      return res.status(200).json({ message: "Stock updated successfully", product });
    } else {
      return res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getAllProducts=async(req,res)=>{
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.getProductById=async(req,res)=>{
  try{
    const {productId}=req.params;
    const product=await Product.findById(productId);
    if(!product){
      return res.status(404).json({message:"Product not found"});
    }
    res.status(200).json({product});
  }catch(err){
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
}