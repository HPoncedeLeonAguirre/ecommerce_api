const postOrderController = require('../../controllers/orderControllers/postOrderController.js');

const postOrderHandler = async (req, res) => {
    try {
        const { id_User, products, shippingAddress } = req.body;

        const order = await postOrderController(id_User, products, shippingAddress);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = postOrderHandler;