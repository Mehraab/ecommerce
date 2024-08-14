const asyncHnadler = require("express-async-handler");
const Product = require("../models/Product");

const createProduct = asyncHnadler(async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(200).json(newProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const getProduct = asyncHnadler(async (req, res) => {
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

const getAllProducts = asyncHnadler(async (req, res) => {
    try {
        const getAllProducts = await Product.find();

        res.status(200).json(getAllProducts);
    }
    catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProduct,
    getProduct,
    getAllProducts
}
