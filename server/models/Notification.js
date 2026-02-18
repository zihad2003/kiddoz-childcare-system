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
            type: DataTypes.ENUM('admin', 'system', 'info', 'warning', 'health', 'activity'),
            defaultValue: 'info'
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        targetRole: {
            type: DataTypes.ENUM('all', 'admin', 'parent', 'staff'),
            defaultValue: 'all'
        },
        recipientId: {
            type: DataTypes.STRING, // User ID or Parent ID
            allowNull: true
        },
        studentId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        details: {
            type: DataTypes.JSON, // To store extra data like observations
            allowNull: true
        }
    });

    return Notification;
};
