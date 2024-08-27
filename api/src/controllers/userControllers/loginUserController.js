const { User } = require("../../config/database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUserController = async (mail, password) => {
    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ where: { mail } });
    if (!user) {
        throw new Error("Correo o contraseña incorrectos");
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Correo o contraseña incorrectos");
    }

    // Generar un nuevo token JWT
    const token = jwt.sign(
        { id_User: user.id_User, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { user, token };
};

module.exports = loginUserController;
