const logger = require('./config/logger.js');

const logAccess = (req, res, next) => {
    const id_User = req.user ? req.user.id : 'Anonimo';
    logger.info(`Intento de acceso: ${req.method} ${req.originalUrl} - IP: ${req.ip} - Usuario: ${id_User}`);
    next();
};

app.use(logAccess);
