const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        "OrderItem", 
        {
            id_OrderItem: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        }, 
        {timestamps: false,}
    );
};