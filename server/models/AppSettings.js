module.exports = (sequelize, DataTypes) => {
    const AppSettings = sequelize.define('AppSettings', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        settingKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        settingValue: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '{}'
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'general'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'app_settings',
        timestamps: true
    });

    return AppSettings;
};
