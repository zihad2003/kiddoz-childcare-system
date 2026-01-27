module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.ENUM('superadmin', 'admin', 'parent', 'teacher', 'nurse', 'nanny'),
            defaultValue: 'parent'
        },
        address: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('active', 'suspended', 'pending'),
            defaultValue: 'active'
        }
    });

    return User;
};
