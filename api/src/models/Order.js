const { DataTypes } = require('sequelize'); 
module.exports = (sequelize) => {
    sequelize.define(
        "Order", 
            {
                id_Order: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                shippingAddress: {
                    type: DataTypes.STRING, 
                    allowNull: false,
                },
                totalAmount: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false, 
                },
                status: {
                    type: DataTypes.ENUM('pending', 'completed', 'shipped'),
                    allowNull: false,
                    defaultValue: 'pending',
                }
            }, 
        {timestamps: true }
    );
};