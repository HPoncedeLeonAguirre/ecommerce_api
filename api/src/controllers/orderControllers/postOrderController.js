const { Order, OrderItem, Product } = require('../../config/database.js'); // Ajusta la ruta según tu estructura de proyecto

// Función para crear una orden de servicio
const postOrderController = async (id_User, products, shippingAddress) => {
    let totalAmount = 0;

    const orderItems = await Promise.all(products.map(async (productData) => {
        const product = await Product.findByPk(productData.id_Product);

        if(!product) {
            throw new Error(`Producto con ID ${productData.id_Product} no existe.`);
        }

        if(product.stock < productData.quantity) {
            throw new Error(`El producto ${product.name} no tiene suficiente stock.`);
        }

        const itemTotal = product.price * productData.quantity;
        totalAmount += itemTotal;

        return {
            id_Product: product.id_Product,
            quantity: productData.quantity,
            price: product.price
        };
    }));

    const order = await Order.create({
        id_User,
        shippingAddress,
        totalAmount,
        status: 'pending' // Establecer un valor predeterminado para el estado
    });

    await Promise.all(orderItems.map(async (item) => {
        await OrderItem.create({
            id_Order: order.id_Order,
            id_Product: item.id_Product,
            quantity: item.quantity,
            price: item.price
        });

        const product = await Product.findByPk(item.id_Product);
        product.stock -= item.quantity;
        await product.save();
    }));
    
    const productsInOrder = await OrderItem.findAll({
        where: { id_Order: order.id_Order },
        include: {
            model: Product,
            attributes: ['id_Product', 'name', 'price'] // Atributos del producto que deseas incluir
        }
    });

    // Formatear la respuesta para incluir los detalles de la orden y los productos
    return {
        id_Order: order.id_Order,
        status: order.status,
        id_User: order.id_User,
        shippingAddress: order.shippingAddress,
        totalAmount: order.totalAmount,
        products: productsInOrder.map(item => ({
            id_Product: item.Product.id_Product,
            name: item.Product.name,
            price: item.Product.price,
            quantity: item.quantity
        }))
    };
};

module.exports = postOrderController;
