module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        id: {
            type: DataTypes.STRING, // Using String ID like 'K-1234'
            primaryKey: true
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        centerId: {
            type: DataTypes.UUID,
            allowNull: true // For now, can be null
        },
        parentName: {
            type: DataTypes.STRING
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
            type: DataTypes.JSON // Store allergies, blood type, medical history summary
        },
        photoUrl: {
            type: DataTypes.STRING
        },
        notes: {
            type: DataTypes.TEXT
        },
        observations: {
            type: DataTypes.TEXT
        }
    });

    return Student;
};
