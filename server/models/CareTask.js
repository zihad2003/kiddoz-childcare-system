module.exports = (sequelize, DataTypes) => {
    const CareTask = sequelize.define('CareTask', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        scheduledTime: {
            type: DataTypes.STRING, // e.g., "09:00 AM"
            allowNull: false
        },
        type: {
            type: DataTypes.STRING, // Diaper, Feed, Nap, etc.
            allowNull: false
        },
        priority: {
            type: DataTypes.STRING, // High, Medium, Low
            defaultValue: 'Medium'
        },
        studentId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        studentName: { // Denormalized for easier display, or use include
            type: DataTypes.STRING,
            allowNull: false
        },
        group: {
            type: DataTypes.STRING, // Infant, Toddler, Preschool
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Completed', 'Skipped'),
            defaultValue: 'Pending'
        },
        completedBy: {
            type: DataTypes.STRING
        },
        completedAt: {
            type: DataTypes.DATE
        },
        details: {
            type: DataTypes.TEXT
        },
        date: { // To separate daily tasks
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        }
    });

    return CareTask;
};
