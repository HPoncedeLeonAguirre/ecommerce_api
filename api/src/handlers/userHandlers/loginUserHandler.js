const loginUserController = require("../../controllers/userControllers/loginUserController.js");

const loginUserHandler = async (req, res) => {
    try {
        const { mail, password } = req.body;

        const { user, token } = await loginUserController(mail, password);

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = loginUserHandler;
