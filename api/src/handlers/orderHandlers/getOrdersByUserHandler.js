const getOrdersByUserController = require("../../controllers/orderControllers/getOrdersByUserController.js");

const getOrdersByUserHandler = async (req, res) => {
    try {
        const { id_User } = req.params;
        const { page, limit, status } = req.query;

        const result = await getOrdersByUserController(id_User, Number(page) || 1, Number(limit) || 10, status);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = getOrdersByUserHandler;