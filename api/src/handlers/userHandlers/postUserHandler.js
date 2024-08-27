const postUserController = require("../../controllers/userControllers/postUserController.js");

const postUserHandler = async (req, res) => {
    try {
        const { name, mail, password, role, phone } = req.body;
        
        const { user, token } = await postUserController(name, mail, password, role, phone);

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = postUserHandler;