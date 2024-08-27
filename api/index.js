const { server } = require("./src/server.js");
const { sequelize } = require("./src/config/database.js");
const PORT = 3001;

server.listen(PORT, async () => {
	try {
		await sequelize.sync({ force: false });
		console.log(`Server listening on port http://localhost:${PORT}`);
	} catch (error) {
		console.error(error);
	}
});