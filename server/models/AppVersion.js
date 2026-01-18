module.exports = (sequelize, DataTypes) => {
    const AppVersion = sequelize.define('AppVersion', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        version: {
            type: DataTypes.STRING,
            allowNull: false
        },
        platform: {
            type: DataTypes.ENUM('ios', 'android', 'web', 'all'),
            defaultValue: 'all'
        },
        releaseNotes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        forceUpdate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.ENUM('draft', 'published', 'archived'),
            defaultValue: 'draft'
        },
        releasedAt: {
            type: DataTypes.DATE
        }
    });
    return AppVersion;
};
