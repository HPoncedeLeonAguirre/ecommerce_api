const jwt = require('jsonwebtoken');
const authenticateUser = require('../../middlewares/authenticationMiddleware');

// Mock de JWT
jest.mock('jsonwebtoken');

describe('authenticateUser middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('debería permitir el acceso si el token es válido', () => {
        const token = 'valid_token';
        const decodedToken = { id_User: '550e8400-e29b-41d4-a716-446655440001', role: 'user' };

        req.header.mockReturnValue(`Bearer ${token}`);
        jwt.verify.mockReturnValue(decodedToken);

        authenticateUser(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
        expect(req.user).toEqual(decodedToken);
        expect(next).toHaveBeenCalled();
    });

    test('debería responder con 401 si no se proporciona un token', () => {
        req.header.mockReturnValue(null);

        authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No se proporcionó un token de autenticación.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('debería responder con 401 si el token es inválido', () => {
        const token = 'invalid_token';

        req.header.mockReturnValue(`Bearer ${token}`);
        jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

        authenticateUser(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
        expect(next).not.toHaveBeenCalled();
    });
});
