const getOrderByIdController = require('../../controllers/orderControllers/getOrderByIdController.js');

const getOrderByIdHandler = async (req, res) => {
    try {
        const { id_Order } = req.params;
        const id_User = req.user.id_User;

        const order = await getOrderByIdController(id_Order, id_User);

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = getOrderByIdHandler;