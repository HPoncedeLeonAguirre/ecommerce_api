const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta operación.' });
    }
    next();
};

module.exports = authorizeAdmin;