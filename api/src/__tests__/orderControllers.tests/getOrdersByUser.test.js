const { Order, Product, OrderItem } = require("../../config/database.js");
const getOrdersByUserController = require("../../controllers/orderControllers/getOrdersByUserController");

// Mock de Sequelize
jest.mock("../../config/database.js");

describe('getOrdersByUserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debería devolver las órdenes del usuario con datos simplificados', async () => {
        // Configurar los datos simulados
        const mockOrders = {
            rows: [
                {
                    id_Order: 1,
                    shippingAddress: '123 Calle Falsa',
                    totalAmount: 100.00,
                    status: 'completed',
                    OrderItems: [
                        {
                            Product: {
                                id_Product: 1,
                                name: 'Producto 1'
                            },
                            quantity: 2,
                            price: 25.00
                        }
                    ]
                }
            ],
            count: 1
        };

        // Configurar el mock de Sequelize
        Order.findAndCountAll = jest.fn().mockResolvedValue(mockOrders);

        const id_User = 1;
        const page = 1;
        const limit = 10;
        const status = 'completed';

        const result = await getOrdersByUserController(id_User, page, limit, status);

        expect(Order.findAndCountAll).toHaveBeenCalledWith({
            where: { id_User: id_User, status: status },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                }
            ],
            offset: 0,
            limit: 10,
            order: [["createdAt", "DESC"]]
        });

        expect(result).toEqual({
            orders: [
                {
                    id_Order: 1,
                    shippingAddress: '123 Calle Falsa',
                    totalAmount: 100.00,
                    status: 'completed',
                    OrderItems: [
                        {
                            id_Product: 1,
                            name: 'Producto 1',
                            quantity: 2,
                            price: 25.00
                        }
                    ]
                }
            ],
            totalOrders: 1,
            totalPages: 1,
            currentPage: 1
        });
    });

    test('debería manejar correctamente la paginación', async () => {
        const mockOrders = {
            rows: [],
            count: 0
        };

        Order.findAndCountAll = jest.fn().mockResolvedValue(mockOrders);

        const id_User = 1;
        const page = 2; // Página diferente
        const limit = 10;

        const result = await getOrdersByUserController(id_User, page, limit);

        expect(Order.findAndCountAll).toHaveBeenCalledWith({
            where: { id_User: id_User },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                }
            ],
            offset: 10, // (2 - 1) * 10
            limit: 10,
            order: [["createdAt", "DESC"]]
        });

        expect(result).toEqual({
            orders: [],
            totalOrders: 0,
            totalPages: 0,
            currentPage: 2
        });
    });

    test('debería manejar correctamente el filtro por estado', async () => {
        const mockOrders = {
            rows: [
                {
                    id_Order: 2,
                    shippingAddress: '456 Calle Verdadera',
                    totalAmount: 200.00,
                    status: 'pending',
                    OrderItems: []
                }
            ],
            count: 1
        };

        Order.findAndCountAll = jest.fn().mockResolvedValue(mockOrders);

        const id_User = 2;
        const page = 1;
        const limit = 10;
        const status = 'pending';

        const result = await getOrdersByUserController(id_User, page, limit, status);

        expect(Order.findAndCountAll).toHaveBeenCalledWith({
            where: { id_User: id_User, status: status },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                }
            ],
            offset: 0,
            limit: 10,
            order: [["createdAt", "DESC"]]
        });

        expect(result).toEqual({
            orders: [
                {
                    id_Order: 2,
                    shippingAddress: '456 Calle Verdadera',
                    totalAmount: 200.00,
                    status: 'pending',
                    OrderItems: []
                }
            ],
            totalOrders: 1,
            totalPages: 1,
            currentPage: 1
        });
    });
});
