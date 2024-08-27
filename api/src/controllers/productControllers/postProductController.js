const { Product } = require("../../config/database.js");

const postProductController = async (name, description, price, stock) => {
    const existingProduct = await Product.findOne({ where: { name } });
    
    if(existingProduct) {
        throw new Error("El producto ya existe");
    }

    const product = await Product.create({
        name,
        description,
        price,
        stock
    });
    return product;
};

module.exports = postProductController;