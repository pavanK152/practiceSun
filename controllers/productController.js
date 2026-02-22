const Product = require("../models/Product");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm Found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();
    firm.products.push(savedProduct);

    await firm.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No Firm Found" });
    }
    const restaurntName = firm.firmName;
    const products = await Product.find({ firm: firmId });

    res.status(200).json({ restaurntName, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "No Product Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductById,
};
