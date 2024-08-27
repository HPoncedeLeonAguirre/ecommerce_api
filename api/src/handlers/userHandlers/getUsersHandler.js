const  getUsersController  = require('../../controllers/userControllers/getUsersController.js');

const getUsersHandler = async (req, res) => {
    try {
        const users = await getUsersController();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

module.exports = getUsersHandler;