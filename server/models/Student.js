module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        id: {
            type: DataTypes.STRING, // Using String ID like 'K-1234'
            primaryKey: true
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER
        },
        gender: {
            type: DataTypes.STRING
        },
        dob: {
            type: DataTypes.DATEONLY
        },
        plan: {
            type: DataTypes.STRING
        },
        enrollmentDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        healthInfo: {
            type: DataTypes.JSON // Store allergies, blood type, etc.
        },
        photoUrl: {
            type: DataTypes.STRING
        },
        // Current status fields (for dashboard)
        attendance: {
            type: DataTypes.STRING,
            defaultValue: 'Absent'
        },
        temp: {
            type: DataTypes.STRING
        },
        mood: {
            type: DataTypes.STRING
        },
        meal: {
            type: DataTypes.STRING
        }
    });

    return Student;
};
