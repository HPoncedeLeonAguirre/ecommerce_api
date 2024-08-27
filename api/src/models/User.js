const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        "User", 
        {
            id_User: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4, 
            },
            role: {
                type: DataTypes.ENUM('admin', 'user'), 
                defaultValue: 'user', 
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING, 
                allowNull: false,
            },
            mail: {
                type: DataTypes.STRING, 
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING, 
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false, 
                defaultValue: true, 
            },
        }, 
        {timestamps: false,}
    );
};
