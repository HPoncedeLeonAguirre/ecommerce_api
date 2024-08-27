const { Order } = require("../../config/database.js");

const updateOrderStatusController = async (id_Order, status, user) => {
    const validStatuses = ["pending", "shipped", "completed"];
    
    if(!validStatuses.includes(status)) {
        throw new Error("El estado de pedido debe ser uno de los siguientes: 'pending', 'shipped', 'completed'.");
    }

    const order = await Order.findByPk(id_Order);
    if(!order) {
        throw new Error(`El pedido con ID ${id_Order} no existe.`);
    }

    order.status = status;
    await order.save();

    return order;
};

module.exports = updateOrderStatusController;