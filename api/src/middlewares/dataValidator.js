const { body, param, query } = require('express-validator');

// Validaciones para crear una orden
const createOrderValidator = [
    // Validación de UUID para el ID del usuario
    body('id_User')
        .isUUID()
        .withMessage('El ID del usuario debe ser un UUID válido'),

    // Validación y sanitización de la dirección de envío
    body('shippingAddress')
        .trim()  // Elimina espacios en blanco al inicio y final
        .escape()  // Escapa caracteres especiales para evitar XSS
        .isString()
        .notEmpty()
        .withMessage('La dirección de envío es obligatoria')
        .isLength({ max: 255 })
        .withMessage('La dirección de envío no debe exceder los 255 caracteres')
        .matches(/^[a-zA-Z0-9\s,.'-]{3,}$/)
        .withMessage('La dirección de envío no es válida'),

    // Validación de que productos es un array
    body('products')
        .isArray({ min: 1 })
        .withMessage('Debe haber al menos un producto en el pedido'),

    // Validación de la estructura del array de productos
    body('products.*')
        .custom(product => {
            if (!product.id_Product || !product.quantity) {
                throw new Error('Cada producto debe tener un id_Product y una cantidad');
            }
            return true;
        }),

    // Validación de UUID para cada ID de producto en el array de productos
    body('products.*.id_Product')
        .isUUID()
        .withMessage('El ID del producto debe ser un UUID válido'),

    // Validación de cantidad como un número entero positivo
    body('products.*.quantity')
        .isInt({ min: 1 })
        .withMessage('La cantidad del producto debe ser un número entero positivo'),

    // Validación de productos duplicados
    body('products')
        .custom(products => {
            const uniqueIds = new Set(products.map(p => p.id_Product));
            if (uniqueIds.size !== products.length) {
                throw new Error('La lista de productos contiene elementos duplicados');
            }
            return true;
        }),
];

// Validaciones para obtener una orden por su ID
const getOrderByIdValidator = [
    // Validación de UUID para el ID del pedido
    param('id_Order')
        .isUUID()
        .withMessage('El ID del pedido debe ser un UUID válido'),
];

// Validaciones para obtener órdenes por usuario con paginación y estado
const getOrdersByUserValidator = [
    // Validación de UUID para el ID del usuario
    param('id_User')
        .isUUID()
        .withMessage('El ID del usuario debe ser un UUID válido'),

    // Validación de la página como un número entero positivo con límites
    query('page')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('La página debe estar entre 1 y 100'),

    // Validación del límite como un número entero positivo con límites
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe estar entre 1 y 100'),

    // Validación del estado del pedido como uno de los valores permitidos
    query('status')
        .optional()
        .isIn(['pending', 'shipped', 'completed'])
        .withMessage('El estado del pedido debe ser uno de los siguientes: pending, shipped, completed'),
];

// Validaciones para actualizar el estado de una orden
const updateOrderStatusValidator = [
    // Validación de UUID para el ID del pedido
    param('id_Order')
        .isUUID()
        .withMessage('El ID del pedido debe ser un UUID válido'),

    // Validación del estado del pedido como uno de los valores permitidos
    body('status')
        .isIn(['pending', 'shipped', 'completed'])
        .withMessage('El estado debe ser uno de los siguientes: pending, shipped, completed')
        .custom((value, { req }) => {
            const currentStatus = req.currentOrderStatus; // Asume que se obtiene antes el estado actual
            if (currentStatus === 'pending' && value === 'completed') {
                throw new Error('No se puede marcar un pedido como completado sin haber sido enviado');
            }
            return true;
        }),
];

// Middleware para manejo global de errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createOrderValidator,
    getOrderByIdValidator,
    getOrdersByUserValidator,
    updateOrderStatusValidator,
    handleValidationErrors
};