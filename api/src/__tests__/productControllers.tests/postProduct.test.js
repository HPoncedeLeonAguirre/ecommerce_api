const { Product } = require('../../config/database.js');
const postProductController = require('../../controllers/productControllers/postProductController');

// Mock de Sequelize
jest.mock('../../config/database.js');

describe('postProductController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debería crear un producto si no existe', async () => {
        const mockProduct = {
            id_Product: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Producto A',
            description: 'Descripción del producto A',
            price: 100,
            stock: 50
        };

        Product.findOne = jest.fn().mockResolvedValue(null); // No hay producto existente
        Product.create = jest.fn().mockResolvedValue(mockProduct);

        const name = 'Producto A';
        const description = 'Descripción del producto A';
        const price = 100;
        const stock = 50;

        const result = await postProductController(name, description, price, stock);

        expect(Product.findOne).toHaveBeenCalledWith({ where: { name } });
        expect(Product.create).toHaveBeenCalledWith({
            name,
            description,
            price,
            stock
        });

        expect(result).toEqual(mockProduct);
    });

    test('debería lanzar un error si el producto ya existe', async () => {
        const existingProduct = {
            id_Product: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Producto A',
            description: 'Descripción del producto A',
            price: 100,
            stock: 50
        };

        Product.findOne = jest.fn().mockResolvedValue(existingProduct); // Producto ya existente

        const name = 'Producto A';
        const description = 'Descripción del producto A';
        const price = 100;
        const stock = 50;

        await expect(postProductController(name, description, price, stock))
            .rejects
            .toThrow('El producto ya existe');
    });
});
