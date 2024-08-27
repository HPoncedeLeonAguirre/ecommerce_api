const { Order, Product, OrderItem } = require("../../config/database.js");

const getOrdersByUserController = async (id_User, page = 1, limit = 10, status) => {
    const offset = (page - 1) * limit;

    const whereClause = { id_User: id_User };
    if (status) {
        whereClause.status = status;
    }

    const orders = await Order.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: OrderItem,
                include: [Product]
            }
        ],
        offset,
        limit,
        order: [["createdAt", "DESC"]]
    });

    const simplifiedOrders = orders.rows.map(order => ({
        id_Order: order.id_Order,
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        status: order.status,
        OrderItems: order.OrderItems.map(item => ({
            id_Product: item.Product.id_Product,
            name: item.Product.name,
            quantity: item.quantity,
            price: item.price
        }))
    }));

    return {
        orders: simplifiedOrders,
        totalOrders: orders.count,
        totalPages: Math.ceil(orders.count / limit),
        currentPage: page
    };
};

module.exports = getOrdersByUserController;