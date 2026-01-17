module.exports = (sequelize, DataTypes) => {
    const Billing = sequelize.define('Billing', {
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
            type: DataTypes.STRING
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pending' // Pending, Paid, Overdue
        },
        description: {
            type: DataTypes.TEXT
        },
        plan: {
            type: DataTypes.STRING
        },
        invoiceNumber: {
            type: DataTypes.STRING
        }
    });

    return Billing;
};
