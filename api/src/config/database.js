const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path"); 
require('dotenv').config(); 
const { DB_URL } = process.env;

if (!DB_URL) {
	throw new Error("Por favor define la variable de entorno DB_URL dentro del archivo .env");
}

const sequelize = new Sequelize(DB_URL,
    {
        logging: false,
        native: false 
    }
);

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "..", "models"))
    .filter(
        (file) =>
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" 
    )
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, "..", "models", file)));
    });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
    entry[0][0].toUpperCase() + entry[0].slice(1),
    entry[1]
]);
sequelize.models = Object.fromEntries(capsEntries);

const { User, Order, Product, OrderItem } = sequelize.models;

User.hasMany(Order, { foreignKey: 'id_User' });
Order.belongsTo(User, { foreignKey: 'id_User' });

Order.hasMany(OrderItem, { foreignKey: 'id_Order' });
OrderItem.belongsTo(Order, { foreignKey: 'id_Order' });

Product.hasMany(OrderItem, { foreignKey: 'id_Product' });
OrderItem.belongsTo(Product, { foreignKey: 'id_Product' });

module.exports = {
    ...sequelize.models,
    sequelize
};