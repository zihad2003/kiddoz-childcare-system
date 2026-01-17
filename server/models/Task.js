module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        assignedTo: {
            type: DataTypes.STRING, // Can be 'All', 'Teacher', or specific User ID
            defaultValue: 'All'
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdBy: {
            type: DataTypes.STRING // Email or Name
        },
        completedBy: {
            type: DataTypes.STRING
        },
        completedAt: {
            type: DataTypes.DATE
        }
    });

    return Task;
};
