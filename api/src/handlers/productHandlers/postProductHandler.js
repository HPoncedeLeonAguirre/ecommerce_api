const postProductController = require("../../controllers/productControllers/postProductController.js");

const postProductHandler = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        const product = await postProductController(name, description, price, stock);
        
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = postProductHandler;