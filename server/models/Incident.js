module.exports = (sequelize, DataTypes) => {
    const Incident = sequelize.define('Incident', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        studentId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('Injury', 'Behavioral', 'Medical', 'Illness', 'Other'),
            defaultValue: 'Injury'
        },
        severity: {
            type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
            defaultValue: 'Low'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        actionTaken: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        reportedBy: {
            type: DataTypes.STRING, // Email or Name
            allowNull: false
        },
        parentNotified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        parentNotifiedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        parentSignature: {
            type: DataTypes.TEXT, // Base64 signature
            allowNull: true
        },
        teacherSignature: {
            type: DataTypes.TEXT, // Base64 signature
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('Open', 'Parent_Pending', 'Resolved', 'Archived'),
            defaultValue: 'Open'
        }
    });

    return Incident;
};
