const authorizeAdmin = require('../../middlewares/authorizationMiddleware');

describe('authorizeAdmin middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('debería permitir el acceso si el usuario es admin', () => {
        req.user.role = 'admin';

        authorizeAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('debería responder con 403 si el usuario no es admin', () => {
        req.user.role = 'user'; // Rol diferente a admin

        authorizeAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permisos para realizar esta operación.' });
        expect(next).not.toHaveBeenCalled();
    });
});
