const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models (Manually for now to be explicit)
db.User = require('./User')(sequelize, Sequelize);
db.Student = require('./Student')(sequelize, Sequelize);
db.Staff = require('./Staff')(sequelize, Sequelize);
// db.Class = require('./Class')(sequelize, Sequelize);
// db.Enrollment = require('./Enrollment')(sequelize, Sequelize);
// db.Attendance = require('./Attendance')(sequelize, Sequelize);
db.Payroll = require('./Payroll')(sequelize, Sequelize);
db.Task = require('./Task')(sequelize, Sequelize);
db.Notification = require('./Notification')(sequelize, Sequelize);
db.CareTask = require('./CareTask')(sequelize, Sequelize);

// Associations
// User has many Students (as parent)
db.User.hasMany(db.Student, { foreignKey: 'parentId', as: 'students' });
db.Student.belongsTo(db.User, { foreignKey: 'parentId', as: 'parent' });

module.exports = db;
