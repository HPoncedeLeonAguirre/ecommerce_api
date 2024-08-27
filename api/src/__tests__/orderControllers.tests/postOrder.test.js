const { Order, OrderItem, Product } = require('../../config/database.js');
const postOrderController = require('../../controllers/orderControllers/postOrderController');

// Mock de Sequelize
jest.mock('../../config/database.js');

describe('postOrderController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debería crear una orden con productos y devolver la información correcta', async () => {
        const mockProduct = {
            id_Product: '550e8400-e29b-41d4-a716-446655440000',
            price: 10.00,
            stock: 20,
            name: 'Producto 1',
            save: jest.fn()
        };

        const mockCreatedOrder = {
            id_Order: '550e8400-e29b-41d4-a716-446655440001',
            id_User: '550e8400-e29b-41d4-a716-446655440002',
            shippingAddress: '123 Calle Falsa',
            totalAmount: 20.00,
            status: 'pending' // Asegúrate de que el estado se devuelva
        };

        const mockOrderItem = {
            Product: {
                id_Product: '550e8400-e29b-41d4-a716-446655440000',
                name: 'Producto 1',
                price: 10.00
            },
            quantity: 2
        };

        // Configurar el mock de Sequelize
        Product.findByPk = jest.fn().mockResolvedValue(mockProduct);
        Order.create = jest.fn().mockResolvedValue(mockCreatedOrder);
        OrderItem.create = jest.fn();
        OrderItem.findAll = jest.fn().mockResolvedValue([mockOrderItem]);

        const id_User = '550e8400-e29b-41d4-a716-446655440002';
        const products = [{ id_Product: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 }];
        const shippingAddress = '123 Calle Falsa';

        const result = await postOrderController(id_User, products, shippingAddress);

        expect(Product.findByPk).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
        expect(Order.create).toHaveBeenCalledWith({
            id_User,
            shippingAddress,
            totalAmount: 20.00,
            status: 'pending'
        });

        expect(OrderItem.create).toHaveBeenCalledWith({
            id_Order: '550e8400-e29b-41d4-a716-446655440001',
            id_Product: '550e8400-e29b-41d4-a716-446655440000',
            quantity: 2,
            price: 10.00
        });

        expect(result).toEqual({
            id_Order: '550e8400-e29b-41d4-a716-446655440001',
            status: 'pending',
            id_User: '550e8400-e29b-41d4-a716-446655440002',
            shippingAddress: '123 Calle Falsa',
            totalAmount: 20.00,
            products: [
                {
                    id_Product: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'Producto 1',
                    price: 10.00,
                    quantity: 2
                }
            ]
        });
    });

    test('debería lanzar un error si un producto no existe', async () => {
        Product.findByPk = jest.fn().mockResolvedValue(null);

        const id_User = '550e8400-e29b-41d4-a716-446655440002';
        const products = [{ id_Product: '550e8400-e29b-41d4-a716-446655440999', quantity: 1 }];
        const shippingAddress = '123 Calle Falsa';

        await expect(postOrderController(id_User, products, shippingAddress))
            .rejects
            .toThrow('Producto con ID 550e8400-e29b-41d4-a716-446655440999 no existe.');
    });

    test('debería lanzar un error si un producto tiene stock insuficiente', async () => {
        const mockProduct = {
            id_Product: '550e8400-e29b-41d4-a716-446655440000',
            price: 10.00,
            stock: 1, // Stock insuficiente
            name: 'Producto 1',
            save: jest.fn()
        };

        Product.findByPk = jest.fn().mockResolvedValue(mockProduct);

        const id_User = '550e8400-e29b-41d4-a716-446655440002';
        const products = [{ id_Product: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 }];
        const shippingAddress = '123 Calle Falsa';

        await expect(postOrderController(id_User, products, shippingAddress))
            .rejects
            .toThrow('El producto Producto 1 no tiene suficiente stock.');
    });
});
