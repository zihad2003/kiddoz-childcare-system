module.exports = (sequelize, DataTypes) => {
    const Bulletin = sequelize.define('Bulletin', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM('Announcement', 'Maintenance', 'Policy', 'Event'),
            defaultValue: 'Announcement'
        },
        priority: {
            type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
            defaultValue: 'Medium'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
            defaultValue: 'Published'
        }
    });

    return Bulletin;
};
