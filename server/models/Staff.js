module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        centerId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        role: {
            type: DataTypes.STRING, // Teacher, Nurse, Nanny
            allowNull: false
        },
        rate: {
            type: DataTypes.STRING
        },
        experience: {
            type: DataTypes.STRING
        },
        specialty: {
            type: DataTypes.STRING
        },
        area: {
            type: DataTypes.STRING
        },
        availability: {
            type: DataTypes.STRING,
            defaultValue: 'Available Now'
        },
        img: {
            type: DataTypes.STRING
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 5.0
        }
    });

    return Staff;
};
