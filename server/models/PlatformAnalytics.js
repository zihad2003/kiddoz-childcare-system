module.exports = (sequelize, DataTypes) => {
    const PlatformAnalytics = sequelize.define('PlatformAnalytics', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        metricName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        dimension: {
            type: DataTypes.STRING,
            allowNull: true
        },
        recordedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
    return PlatformAnalytics;
};
