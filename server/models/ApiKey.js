module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define('ApiKey', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        permissions: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastUsedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'revoked'),
            defaultValue: 'active'
        }
    });

    return ApiKey;
};
