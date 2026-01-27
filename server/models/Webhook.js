module.exports = (sequelize, DataTypes) => {
    const Webhook = sequelize.define('Webhook', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isUrl: true }
        },
        events: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        apiUserId: {
            type: DataTypes.UUID,
            allowNull: true
        }
    });
    return Webhook;
};
