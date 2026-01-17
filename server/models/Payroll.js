module.exports = (sequelize, DataTypes) => {
    const Payroll = sequelize.define('Payroll', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        recipientName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Paid'),
            defaultValue: 'Pending'
        },
        type: {
            type: DataTypes.ENUM('Salary', 'Maintenance', 'Bonus', 'Reimbursement'),
            defaultValue: 'Salary'
        },
        date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        }
    });

    return Payroll;
};
