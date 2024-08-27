const { Order, OrderItem, Product } = require('../../config/database.js');

const getOrderByIdController = async (id_Order, id_User) => {
    const order = await Order.findOne({
        where: { id_Order: id_Order },
        include: {
            model: OrderItem,
            include: {
                model: Product,
                attributes: ['name', 'price']
            }
        }
    });

    if(!order) {
        throw new Error(`El pedido con ID ${id_Order} no existe.`);
    }

    if(order.id_User !== id_User) {
        throw new Error("No tienes permiso para ver este pedido.");
    }

    const orderDetails = {
        id_Order: order.id_Order,
        status: order.status,
        totalAmount: order.totalAmount,
        items: order.OrderItems.map(item => ({
            product: item.Product.name,
            quantity: item.quantity,
            price: item.Product.price
        }))
    };
    return orderDetails;
};

module.exports = getOrderByIdController;
