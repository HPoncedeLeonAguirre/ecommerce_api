const updateOrderStatusController = require("../../controllers/orderControllers/updateOrderStatusController.js");

const updateOrderStatusHandler = async (req, res) => {
    try {
        const { id_Order } = req.params;
        const { status } = req.body;

        const user = req.user;

        const order = await updateOrderStatusController(id_Order, status, user);
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = updateOrderStatusHandler;