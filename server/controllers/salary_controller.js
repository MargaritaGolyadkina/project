const { Salary, Task, Prize, User } = require('../models/models');
const { Op } = require('sequelize');

// Подсчёт бонусов
const calculateBonuses = async (userId, month) => {
    const taskBonusRate = 100; // фиксированная сумма за выполненную задачу
    const prizeBonusRate = 200; // фиксированная сумма за каждый приз

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const completedTasks = await Task.count({
        where: {
            assigned_to: userId,
            status: 'выполнена',
            updated_at: {
                [Op.between]: [startDate, endDate]
            }
        }
    });

    const prizes = await Prize.count({
        where: {
            assigned_to: userId,
            date_awarded: {
                [Op.between]: [startDate, endDate]
            }
        }
    });

    return {
        taskBonus: completedTasks * taskBonusRate,
        prizeBonus: prizes * prizeBonusRate
    };
};

// ✅ Создать или обновить зарплату
exports.createOrUpdateSalary = async (req, res) => {
    try {
        const {
            user_id,
            base_salary,
            task_bonus = 0,
            prize_bonus = 0,
            month,
            note
        } = req.body;

        const total_salary = parseFloat(base_salary) + parseFloat(task_bonus) + parseFloat(prize_bonus);

        const [salary, created] = await Salary.findOrCreate({
            where: { user_id, month },
            defaults: {
                base_salary,
                task_bonus,
                prize_bonus,
                total_salary,
                note
            }
        });

        if (!created) {
            await salary.update({
                base_salary,
                task_bonus,
                prize_bonus,
                total_salary,
                note
            });
        }

        res.status(200).json(salary);
    } catch (error) {
        console.error('Ошибка при создании/обновлении зарплаты:', error);
        res.status(500).json({ error: 'Ошибка при создании/обновлении зарплаты' });
    }
};

// ✅ Получить все зарплаты
exports.getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.findAll({ include: { model: User } });
        res.json(salaries);
    } catch (error) {
        console.error('Ошибка при получении зарплат:', error);
        res.status(500).json({ error: 'Ошибка при получении зарплат' });
    }
};

// ✅ Получить зарплаты по user_id
exports.getSalaryByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const salaries = await Salary.findAll({
            where: { user_id: userId },
            order: [['month', 'DESC']]
        });
        res.json(salaries);
    } catch (error) {
        console.error('Ошибка при получении зарплат пользователя:', error);
        res.status(500).json({ error: 'Ошибка при получении зарплат пользователя' });
    }
};

// ✅ Удалить запись
exports.deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        await Salary.destroy({ where: { id } });
        res.json({ message: 'Зарплата удалена' });
    } catch (error) {
        console.error('Ошибка при удалении зарплаты:', error);
        res.status(500).json({ error: 'Ошибка при удалении зарплаты' });
    }
};
