const { Order } = require('../../config/database.js');
const updateOrderStatusController = require('../../controllers/orderControllers/updateOrderStatusController');

jest.mock('../../config/database.js'); // Mockeamos el modelo Order

describe('updateOrderStatusController', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpiamos los mocks después de cada prueba
    });

    it('debería actualizar el estado de la orden correctamente cuando el estado es válido', async () => {
        const mockOrder = { id_Order: 'uuid-order-1', status: 'pending', save: jest.fn() };

        // Mock de Order.findByPk
        Order.findByPk.mockResolvedValue(mockOrder);

        const result = await updateOrderStatusController('uuid-order-1', 'shipped');

        // Comparar solo las propiedades relevantes
        expect(result.id_Order).toBe('uuid-order-1');
        expect(result.status).toBe('shipped');
        expect(mockOrder.save).toHaveBeenCalled();
    });

    it('debería lanzar un error si el estado no es válido', async () => {
        await expect(updateOrderStatusController('uuid-order-1', 'invalid-status'))
            .rejects
            .toThrow("El estado de pedido debe ser uno de los siguientes: 'pending', 'shipped', 'completed'.");
    });

    it('debería lanzar un error si la orden no existe', async () => {
        // Mock de Order.findByPk para que devuelva null
        Order.findByPk.mockResolvedValue(null);

        await expect(updateOrderStatusController('uuid-order-1', 'shipped'))
            .rejects
            .toThrow('El pedido con ID uuid-order-1 no existe.');
    });
});
