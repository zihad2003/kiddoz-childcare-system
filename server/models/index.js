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
db.HealthRecord = require('./HealthRecord')(sequelize, Sequelize);
db.DailyActivity = require('./DailyActivity')(sequelize, Sequelize);
db.Billing = require('./Billing')(sequelize, Sequelize);
db.NannyBooking = require('./NannyBooking')(sequelize, Sequelize);
db.AppSettings = require('./AppSettings')(sequelize, Sequelize);
db.AuditLog = require('./AuditLog')(sequelize, Sequelize);
db.ApiKey = require('./ApiKey')(sequelize, Sequelize);
db.Webhook = require('./Webhook')(sequelize, Sequelize);
db.AppVersion = require('./AppVersion')(sequelize, Sequelize);
db.Feedback = require('./Feedback')(sequelize, Sequelize);
db.PlatformAnalytics = require('./PlatformAnalytics')(sequelize, Sequelize);
db.Center = require('./Center')(sequelize, Sequelize);

// Associations
// User has many Students (as parent)
db.User.hasMany(db.Student, { foreignKey: 'parentId', as: 'students' });
db.Student.belongsTo(db.User, { foreignKey: 'parentId', as: 'parent' });

// Super Admin Associations
db.User.hasMany(db.AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
db.AuditLog.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.User.hasMany(db.ApiKey, { foreignKey: 'createdBy', as: 'apiKeys' });
db.ApiKey.belongsTo(db.User, { foreignKey: 'createdBy', as: 'creator' });

db.User.hasMany(db.Feedback, { foreignKey: 'userId', as: 'feedback' });
db.Feedback.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

module.exports = db;
