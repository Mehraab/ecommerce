const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const productService = require("../service/productService");
const { default: slugify } = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.status(200).json(newProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getProduct = await Product.findById(id);
        if (!getProduct) throw new Error("Product not found");

        res.status(200).json(getProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const getAllProducts = await productService.getProduct(req);

        res.status(200).json(getAllProducts);
    }
    catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    try {
        const update = await productService.updateProduct(req);

        res.json(update);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const {id}  = req.params;
    try {
        const update = await Product.findByIdAndD(id);
        res.json(update);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}
