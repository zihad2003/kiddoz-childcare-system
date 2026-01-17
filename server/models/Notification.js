module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('admin', 'system', 'info', 'warning'),
            defaultValue: 'info'
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Notification;
};
