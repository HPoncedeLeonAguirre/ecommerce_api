const { User } = require("../../config/database.js");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const postUserController = async (name, mail, password, role) => {
    const existingUser = await User.findOne({ where: { mail } });

    if (existingUser) {
        throw new Error("El mail ya está registrado");
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    const user = await User.create({
        name,
        mail,
        password: hashedPassword,
        role,
    });

    const token = jwt.sign(
        { id_User: user.id_User,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return { user, token };
};

module.exports = postUserController;