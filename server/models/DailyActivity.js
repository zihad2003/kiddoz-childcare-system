module.exports = (sequelize, DataTypes) => {
    const DailyActivity = sequelize.define('DailyActivity', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        studentId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activityType: {
            type: DataTypes.STRING, // meal, nap, mood, temperature, diaper
            allowNull: false
        },
        value: {
            type: DataTypes.STRING, // e.g., "Finished", "98.6°F", "Happy"
            allowNull: false
        },
        details: {
            type: DataTypes.TEXT
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        recordedBy: {
            type: DataTypes.STRING
        }
    });

    return DailyActivity;
};
