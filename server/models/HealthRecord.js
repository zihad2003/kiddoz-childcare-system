module.exports = (sequelize, DataTypes) => {
    const HealthRecord = sequelize.define('HealthRecord', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        studentId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        recordType: {
            type: DataTypes.STRING, // Vaccination, Checkup, Allergy, etc.
            allowNull: false
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fileUrl: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        uploadedBy: {
            type: DataTypes.STRING
        },
        uploadedAt: {
            type: DataTypes.DATE
        }
    });

    return HealthRecord;
};
