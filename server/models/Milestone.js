module.exports = (sequelize, DataTypes) => {
    const Milestone = sequelize.define('Milestone', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        studentId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING, // e.g. "First Words", "Walking", "Counting to 10"
            allowNull: false
        },
        category: {
            type: DataTypes.STRING, // Cognitive, Physical, Social, Language
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        achievedDate: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        recordedBy: {
            type: DataTypes.STRING
        }
    });

    return Milestone;
};
