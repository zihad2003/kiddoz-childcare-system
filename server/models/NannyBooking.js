module.exports = (sequelize, DataTypes) => {
    const NannyBooking = sequelize.define('NannyBooking', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        studentId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nannyId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nannyName: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME
        },
        endTime: {
            type: DataTypes.TIME
        },
        duration: {
            type: DataTypes.STRING // e.g., "3 hours"
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending' // Pending, Confirmed, Completed, Cancelled
        },
        notes: {
            type: DataTypes.TEXT
        },
        totalCost: {
            type: DataTypes.DECIMAL(10, 2)
        }
    });

    return NannyBooking;
};
