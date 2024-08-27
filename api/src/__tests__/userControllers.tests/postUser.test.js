const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../config/database.js');
const postUserController = require('../../controllers/userControllers/postUserController');

// Mock de Sequelize y otras dependencias
jest.mock('../../config/database.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('postUserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debería crear un usuario y devolver un token', async () => {
        const mockUser = {
            id_User: '550e8400-e29b-41d4-a716-446655440001',
            name: 'John Doe',
            mail: 'john@example.com',
            role: 'user',
            password: 'hashed_password'
        };

        const mockToken = 'mock_token';

        User.findOne = jest.fn().mockResolvedValue(null); // No hay usuario existente
        bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
        User.create = jest.fn().mockResolvedValue(mockUser);
        jwt.sign = jest.fn().mockReturnValue(mockToken);

        const name = 'John Doe';
        const mail = 'john@example.com';
        const password = 'password123';
        const role = 'user';

        const result = await postUserController(name, mail, password, role);

        expect(User.findOne).toHaveBeenCalledWith({ where: { mail } });
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
        expect(User.create).toHaveBeenCalledWith({
            name,
            mail,
            password: 'hashed_password',
            role,
        });
        expect(jwt.sign).toHaveBeenCalledWith(
            { id_User: mockUser.id_User, role: mockUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        expect(result).toEqual({
            user: mockUser,
            token: mockToken
        });
    });

    test('debería lanzar un error si el mail ya está registrado', async () => {
        const existingUser = {
            id_User: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Jane Doe',
            mail: 'john@example.com',
            password: 'hashed_password',
            role: 'user'
        };

        User.findOne = jest.fn().mockResolvedValue(existingUser);

        const name = 'John Doe';
        const mail = 'john@example.com';
        const password = 'password123';
        const role = 'user';

        await expect(postUserController(name, mail, password, role))
            .rejects
            .toThrow('El mail ya está registrado');
    });
});
