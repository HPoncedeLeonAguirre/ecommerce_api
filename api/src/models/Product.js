const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define(
		"Product",
		{
			id_Product: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			stock: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			active: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			}
		},
		{ timestamps: false }
	);
};
