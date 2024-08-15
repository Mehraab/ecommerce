const Product = require("../models/Product");
const slugify = require('slugify');

const getProduct = async (req) => { 
    let products;
    let queryStr, query;
    try {
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];

        excludeFields.forEach((el) => delete queryObj[el]);
        queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
        console.log(queryObj, queryStr);
        query = Product.find(JSON.parse(queryStr));
        
        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }
        else {
            query = query.sort('-createdAt');
        }

        //limiting fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }
        else {
            query = query.select("-__v");
        }

        //pagination
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page doesnt exist");
        }

        products = await query;

        return products;
    }
    catch (err) {
        throw new Error(err.message);
    }
    finally {
        products = queryStr = query = null;
    }
};

const updateProduct = async (req) => {
    const { id } = req.params;
    try {
         if (req.body.title) {
             req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        
        return updatedProduct;
    }

    catch (err) {
        throw new Error(err);
   }
};

module.exports = {
    getProduct,
    updateProduct
}