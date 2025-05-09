import React, { useState, useContext, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOwner } from "@/Context/OwnerContext";
import { ThemeContext } from "@/Context/ThemeContext";

const categories = [
  { id: "men", name: "Men" },
  { id: "women", name: "Women" },
  { id: "kids", name: "Kids" },
];

const sizes = [
  { id: "xs", name: "XS" },
  { id: "s", name: "S" },
  { id: "m", name: "M" },
  { id: "l", name: "L" },
  { id: "xl", name: "XL" },
  { id: "xxl", name: "XXL" },
  {id: "one-size", name: "one-size" },
];

const colors = [
  // First row
  { id: "black", name: "Black", hex: "#000000" },
  { id: "charcoal", name: "Charcoal", hex: "#36454F" },
  { id: "grey", name: "Grey", hex: "#808080" },
  { id: "silver", name: "Silver", hex: "#C0C0C0" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "ivory", name: "Ivory", hex: "#FFFFF0" },
  { id: "khaki", name: "Khaki", hex: "#F0E68C" },

  // Second row
  { id: "regal-red", name: "Regal Red", hex: "#A91B0D" },
  { id: "brick-red", name: "Brick Red", hex: "#CB4154" },
  { id: "copper", name: "Copper", hex: "#B87333" },
  { id: "terra-cotta", name: "Terra Cotta", hex: "#E2725B" },
  { id: "chocolate", name: "Chocolate", hex: "#7B3F00" },
  { id: "cinnamon", name: "Cinnamon", hex: "#D2691E" },
  { id: "almond", name: "Almond", hex: "#EFDECD" },

  // Third row
  { id: "red", name: "Red", hex: "#FF0000" },
  { id: "burgundy", name: "Burgundy", hex: "#800020" },
  { id: "raspberry", name: "Raspberry", hex: "#E30B5D" },
  { id: "magenta", name: "Magenta", hex: "#FF00FF" },
  { id: "bubblegum", name: "Bubblegum", hex: "#FFC1CC" },
  { id: "shrimp", name: "Shrimp", hex: "#E29D9D" },
  { id: "dusty-rose", name: "Dusty Rose", hex: "#DCAE96" },

  // Fourth row
  { id: "canary", name: "Canary", hex: "#FFFF99" },
  { id: "gold", name: "Gold", hex: "#FFD700" },
  { id: "orange", name: "Orange", hex: "#FFA500" },
  { id: "pumpkin", name: "Pumpkin", hex: "#FF7518" },
  { id: "coral", name: "Coral", hex: "#FF7F50" },
  { id: "peach", name: "Peach", hex: "#FFE5B4" },
  { id: "pink", name: "Pink", hex: "#FFC0CB" },

  // Fifth row
  { id: "buttercup", name: "Buttercup", hex: "#F3E5AB" },
  { id: "mint", name: "Mint", hex: "#3EB489" },
  { id: "lime", name: "Lime", hex: "#00FF00" },
  { id: "celadon", name: "Celadon", hex: "#ACE1AF" },
  { id: "olive", name: "Olive", hex: "#808000" },
  { id: "kelly-green", name: "Kelly Green", hex: "#4CBB17" },
  { id: "grass-green", name: "Grass Green", hex: "#7CFC00" },

  // Sixth row
  { id: "slate", name: "Slate", hex: "#708090" },
  { id: "cornflower", name: "Cornflower", hex: "#6495ED" },
  { id: "sea-mist", name: "Sea Mist", hex: "#B3C7D6" },
  { id: "turquoise", name: "Turquoise", hex: "#40E0D0" },
  { id: "regal-teal", name: "Regal Teal", hex: "#008080" },
  { id: "teal", name: "Teal", hex: "#008080" },
  { id: "hunter-green", name: "Hunter Green", hex: "#355E3B" },

  // Seventh row
  { id: "electric-blue", name: "Electric Blue", hex: "#7DF9FF" },
  { id: "royal-blue", name: "Royal Blue", hex: "#4169E1" },
  { id: "navy", name: "Navy", hex: "#000080" },
  { id: "regal-purple", name: "Regal Purple", hex: "#6C3082" },
  { id: "plum", name: "Plum", hex: "#8E4585" },
  { id: "amethyst", name: "Amethyst", hex: "#9966CC" },
  { id: "lilac", name: "Lilac", hex: "#C8A2C8" }
];
const AddProduct = () => {
  const { theme } = useContext(ThemeContext);
  const { addProduct } = useOwner();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sizesOptional, setSizesOptional] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    mainCategory: "men",
    category: "",
    sizes: [],
    colors: [],
    status: "Regular",
    quantity: 1,
  });

  // Theme-aware styles
  const inputStyles = `block w-full rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-offset-2 sm:text-sm ${
    theme === "dark"
      ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500 focus:border-gray-500"
      : "border-gray-300 focus:ring-gray-500 focus:border-gray-500"
  }`;

  const labelStyles = `block text-sm font-medium mb-1 ${
    theme === "dark" ? "text-gray-300" : "text-gray-700"
  }`;

  const cardStyles = theme === "dark" ? "bg-gray-800 border-gray-700" : "";

  useEffect(() => {
    setSizesOptional(formData.mainCategory === "women");
  }, [formData.mainCategory]);

  const buttonVariant = (isSelected) =>
    theme === "dark"
      ? isSelected
        ? "bg-gray-600 text-white border-gray-600"
        : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
      : isSelected
      ? "bg-gray-900 text-white border-gray-900"
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const productData = {
      ...formData,
      sizes: selectedSizes.join(","),
      colors: selectedColors.join(","),
    };

    const formDataObj = new FormData();

    // Append product data
    Object.keys(productData).forEach((key) => {
      formDataObj.append(key, productData[key]);
    });

    // Append photos
    selectedImages.forEach((image) => {
      formDataObj.append("photo", image);
    });

    // console.log("Form Data:", Object.fromEntries(formDataObj.entries())); // For debugging

    try {
      await addProduct(formDataObj);
      alert("Product added successfully!");
      // Reset form after successful submission
      setFormData({
        name: "",
        price: "",
        description: "",
        mainCategory: "",
        category: "",
        sizes: [],
        colors: [],
        status: "Regular",
        quantity: 1,
      });
      setSelectedImages([]);
      setSelectedSizes([]);
      setSelectedColors([]);
    } catch (error) {
      alert("Failed to add product.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };

  const handleSizeToggle = (sizeId) => {
    if (selectedSizes.includes(sizeId)) {
      setSelectedSizes(selectedSizes.filter((id) => id !== sizeId));
    } else {
      setSelectedSizes([...selectedSizes, sizeId]);
    }
  };

  const handleColorToggle = (colorId) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter((id) => id !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Check if adding these files would exceed 5
    if (selectedImages.length + files.length > 5) {
      alert("You can upload a maximum of 5 photos");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Create image preview URLs
  const imagePreviews = selectedImages.map((file) => URL.createObjectURL(file));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className={cardStyles}>
        <CardHeader>
          <CardTitle className={theme === "dark" ? "text-white" : ""}>
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className={labelStyles}>Product Image</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:overflow-visible">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 relative w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed rounded-lg ${
                        theme === "dark" ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <img
                        src={preview}
                        alt="Product preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={`absolute -top-2 -right-2 rounded-full p-1 shadow-sm border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <X
                          size={16}
                          className={
                            theme === "dark" ? "text-gray-300" : "text-gray-500"
                          }
                        />
                      </button>
                    </div>
                  ))}

                  {selectedImages.length < 5 && (
                    <div
                      className={`flex-shrink-0 relative w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${
                        theme === "dark" ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <Upload
                        size={20}
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      />
                      <input
                        type="file"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>

                <div className="sm:flex-1">
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Click the icon to upload high-quality images of your
                    product. Recommended size: 1000x1000px. Max size: 5MB.
                    Supported formats: JPG, PNG.
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {selectedImages.length}/5 photos uploaded
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={labelStyles}>
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputStyles}
                  placeholder="e.g. Classic White T-Shirt"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className={labelStyles}>
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={inputStyles}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className={labelStyles}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={inputStyles}
                  placeholder="29.99"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="quantity" className={labelStyles}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={inputStyles}
                  placeholder="100"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelStyles}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={inputStyles}
                placeholder="Enter product description..."
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cardStyles}>
        <CardHeader>
          <CardTitle className={theme === "dark" ? "text-white" : ""}>
            Product Variants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className={labelStyles}>Available Sizes</label>
                {sizesOptional && (
                  <span
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    (Optional for women's products)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => handleSizeToggle(size.id)}
                    className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${buttonVariant(
                      selectedSizes.includes(size.id)
                    )} ${
                      sizesOptional && selectedSizes.length === 0
                        ? "opacity-70"
                        : ""
                    }`}
                    disabled={isLoading}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              {sizesOptional && selectedSizes.length === 0 && (
                <p
                  className={`mt-1 text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No sizes selected - product will be marked as "One Size"
                </p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Available Colors</label>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorToggle(color.id)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColors.includes(color.id)
                        ? theme === "dark"
                          ? "border-gray-300 scale-110"
                          : "border-gray-900 scale-110"
                        : theme === "dark"
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  >
                    <span
                      className="absolute inset-1 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    ></span>
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
              <div
                className={`mt-2 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Selected colors:{" "}
                {selectedColors.length
                  ? colors
                      .filter((c) => selectedColors.includes(c.id))
                      .map((c) => c.name)
                      .join(", ")
                  : "None"}
              </div>
            </div>

            <div>
              <label className={labelStyles}>Product Status</label>
              <div className="flex space-x-4">
                {["Regular", "New Arrival", "On Sale"].map((status) => (
                  <div key={status} className="flex items-center">
                    <input
                      id={`status-${status.toLowerCase().replace(" ", "-")}`}
                      name="status"
                      type="radio"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleInputChange}
                      className={`h-4 w-4 ${
                        theme === "dark"
                          ? "border-gray-500 text-gray-900 focus:ring-gray-500"
                          : "border-gray-300 text-gray-900 focus:ring-gray-500"
                      }`}
                    />
                    <label
                      htmlFor={`status-${status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                      className={`ml-2 block text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button
          type="submit"
          className={
            theme === "dark"
              ? "bg-gray-600 hover:bg-gray-500"
              : "bg-gray-900 hover:bg-gray-800"
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddProduct;
