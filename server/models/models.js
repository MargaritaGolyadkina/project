const { DataTypes } = require('sequelize');
const sequelize = require('../db');
//const { updateAnalytics } = require("../controllers/analytics_controller");


// Таблица ролей (Roles)
const Role = sequelize.define('role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { 
        type: DataTypes.ENUM('Сотрудник', 'Руководитель', 'Администратор'), 
        unique: true, 
        allowNull: false 
    }
}, { underscored: true, tableName: 'roles' });

// Таблица прав доступа (Permissions)
const Permission = sequelize.define('permission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), unique: true, allowNull: false }
}, { underscored: true, tableName: 'permissions' });

// Таблица пользователей (User)
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    surname: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false }
}, { underscored: true, tableName: 'users' });

// Таблица задач (Task)
const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.STRING(500), allowNull: false },
    status: {
        type: DataTypes.ENUM('создана', 'в работе', 'на проверке', 'выполнена', 'выполнено не верно'), // Добавлен статус "на проверке"
        allowNull: false,
        defaultValue: 'создана'
    },
    comment: { type: DataTypes.STRING(255) },
    assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    }
}, { underscored: true, tableName: 'tasks' });



// Таблица призов (Prize)
const Prize = sequelize.define(
    "prize",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        description: { type: DataTypes.STRING(50), allowNull: false },
        level: { type: DataTypes.STRING(100) },
        date_awarded: { type: DataTypes.DATE },
        photo: { type: DataTypes.STRING, allowNull: true }, // URL фотографии
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "users", key: "id" },
        },
    },
    { underscored: true, tableName: "prizes" }
);

// Таблица аналитики (Analytics)
const Analytics = sequelize.define('analytics', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    created_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    in_progress_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    review_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    completed_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    incorrect_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { underscored: true, tableName: 'analytics' });



const Salary = sequelize.define('salary', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },

    base_salary: {
        type: DataTypes.DECIMAL(10, 2), // фиксированная зарплата
        allowNull: false,
        defaultValue: 0.00
    },

    task_bonus: {
        type: DataTypes.DECIMAL(10, 2), // бонус за задачи
        allowNull: false,
        defaultValue: 0.00
    },

    prize_bonus: {
        type: DataTypes.DECIMAL(10, 2), // бонус за призы
        allowNull: false,
        defaultValue: 0.00
    },

    total_salary: {
        type: DataTypes.DECIMAL(10, 2), // общая сумма
        allowNull: false,
        defaultValue: 0.00
    },

    month: {
        type: DataTypes.STRING(7), // формат YYYY-MM
        allowNull: false
    },

    note: {
        type: DataTypes.STRING(255), // комментарий администратора
        allowNull: true
    }
}, {
    underscored: true,
    tableName: 'salaries'
});

// Связь с пользователем

Salary.belongsTo(User, { foreignKey: 'user_id' });



// Связи
Role.belongsToMany(Permission, { through: 'role_permissions', foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: 'role_permissions', foreignKey: 'permission_id' });



User.belongsTo(Role, { foreignKey: 'role_id' });
// Метод для получения имени роли
User.prototype.getRoleName = function() {
    return this.role ? this.role.name : null; // Возвращаем имя роли
};
User.hasMany(Task, { foreignKey: 'user_id' });
User.hasMany(Prize, { foreignKey: "assigned_to", as: "assignedPrizes" });
Prize.belongsTo(User, { foreignKey: "assigned_to", as: "assignedUser" });

Task.belongsTo(User, { foreignKey: 'user_id' }); 
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' }); 
Analytics.belongsTo(Task, { foreignKey: 'task_id' });



// Хук для обновления аналитики
Task.afterUpdate(async () => {
    Task.afterCreate(async () => {
        await updateAnalytics();
    });
    
    Task.afterDestroy(async () => {
        await updateAnalytics();
    });
    
    const [analytics] = await Analytics.findOrCreate({ where: { id: 1 }, defaults: {} });
    
    const counts = await Promise.all([
        Task.count({ where: { status: 'создана' } }),
        Task.count({ where: { status: 'в работе' } }),
        Task.count({ where: { status: 'на проверке' } }),
        Task.count({ where: { status: 'выполнена' } }),
        Task.count({ where: { status: 'выполнено не верно' } })
    ]);
    
    await analytics.update({
        created_count: counts[0],
        in_progress_count: counts[1],
        review_count: counts [2],
        completed_count: counts[3],
        incorrect_count: counts[4]
    });
});

module.exports = { Role, Permission, User, Task, Prize, Analytics, Salary };
