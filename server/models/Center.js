module.exports = (sequelize, DataTypes) => {
    const Center = sequelize.define('Center', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contactEmail: {
            type: DataTypes.STRING
        },
        contactPhone: {
            type: DataTypes.STRING
        },
        capacity: {
            type: DataTypes.INTEGER,
            defaultValue: 100
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
            defaultValue: 'active'
        },
        subscriptionPlan: {
            type: DataTypes.STRING,
            defaultValue: 'Enterprise'
        }
    });

    return Center;
};
