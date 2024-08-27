const { Order, OrderItem, Product } = require('../../config/database.js');
const getOrderByIdController = require('../../controllers/orderControllers/getOrderByIdController.js');

jest.mock('../../config/database.js'); // Mockeamos los modelos

describe('getOrderByIdController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpiamos los mocks después de cada prueba
    });

    it('debería devolver los detalles del pedido si el pedido existe y pertenece al usuario', async () => {
        // Simulamos un pedido con items
        const mockOrder = {
            id_Order: 'uuid-order-123',
            id_User: 'uuid-user-123',
            status: 'Pendiente',
            totalAmount: 100,
            OrderItems: [
                {
                    quantity: 2,
                    Product: {
                        name: 'Producto 1',
                        price: 25
                    }
                },
                {
                    quantity: 1,
                    Product: {
                        name: 'Producto 2',
                        price: 50
                    }
                }
            ]
        };

        Order.findOne.mockResolvedValue(mockOrder); // Simulamos la consulta a la base de datos

        const result = await getOrderByIdController('uuid-order-123', 'uuid-user-123');

        expect(result).toEqual({
            id_Order: 'uuid-order-123',
            status: 'Pendiente',
            totalAmount: 100,
            items: [
                {
                    product: 'Producto 1',
                    quantity: 2,
                    price: 25
                },
                {
                    product: 'Producto 2',
                    quantity: 1,
                    price: 50
                }
            ]
        });
    });

    it('debería lanzar un error si el pedido no existe', async () => {
        Order.findOne.mockResolvedValue(null); // Simulamos que no se encuentra el pedido

        await expect(getOrderByIdController('uuid-order-123', 'uuid-user-123'))
            .rejects
            .toThrow('El pedido con ID uuid-order-123 no existe.');
    });

    it('debería lanzar un error si el pedido no pertenece al usuario', async () => {
        const mockOrder = {
            id_Order: 'uuid-order-123',
            id_User: 'uuid-user-456', // ID de usuario diferente
            status: 'Pendiente',
            totalAmount: 100,
            OrderItems: []
        };

        Order.findOne.mockResolvedValue(mockOrder); // Simulamos la consulta a la base de datos

        await expect(getOrderByIdController('uuid-order-123', 'uuid-user-123'))
            .rejects
            .toThrow('No tienes permiso para ver este pedido.');
    });
});
