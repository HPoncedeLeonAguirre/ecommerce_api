const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../config/database.js');
const loginUserController = require('../../controllers/userControllers/loginUserController');

// Mock de Sequelize y otras dependencias
jest.mock('../../config/database.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('loginUserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debería autenticar al usuario y devolver un token', async () => {
        const mockUser = {
            id_User: '550e8400-e29b-41d4-a716-446655440001',
            mail: 'john@example.com',
            password: 'hashed_password',
            role: 'user'
        };

        const mockToken = 'mock_token';

        User.findOne = jest.fn().mockResolvedValue(mockUser); // Usuario encontrado
        bcrypt.compare = jest.fn().mockResolvedValue(true); // Contraseña correcta
        jwt.sign = jest.fn().mockReturnValue(mockToken);

        const mail = 'john@example.com';
        const password = 'password123';

        const result = await loginUserController(mail, password);

        expect(User.findOne).toHaveBeenCalledWith({ where: { mail } });
        expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
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

    test('debería lanzar un error si el correo electrónico no está registrado', async () => {
        User.findOne = jest.fn().mockResolvedValue(null); // Usuario no encontrado

        const mail = 'john@example.com';
        const password = 'password123';

        await expect(loginUserController(mail, password))
            .rejects
            .toThrow('Correo o contraseña incorrectos');
    });

    test('debería lanzar un error si la contraseña es incorrecta', async () => {
        const mockUser = {
            id_User: '550e8400-e29b-41d4-a716-446655440001',
            mail: 'john@example.com',
            password: 'hashed_password',
            role: 'user'
        };

        User.findOne = jest.fn().mockResolvedValue(mockUser); // Usuario encontrado
        bcrypt.compare = jest.fn().mockResolvedValue(false); // Contraseña incorrecta

        const mail = 'john@example.com';
        const password = 'password123';

        await expect(loginUserController(mail, password))
            .rejects
            .toThrow('Correo o contraseña incorrectos');
    });
});
