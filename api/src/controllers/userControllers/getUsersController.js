const { User } = require("../../config/database.js");

const getUsersController = async () => {
	const users = await User.findAll();
	return users;
};

module.exports = getUsersController;