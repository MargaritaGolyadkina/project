const { Task, User } = require("../models/models");
const analyticsController = require("./analytics_controller");

class TaskController {
    // Получение всех задач
    async getAll(req, res) {
        try {
            const tasks = await Task.findAll({
                include: [
                    { model: User, as: "assignedUser", attributes: ["id", "name", "surname", "email"] }
                ]
            });
            res.json(tasks);
        } catch (error) {
            console.error("Ошибка при получении списка задач:", error);
            res.status(500).json({ error: "Ошибка при получении списка задач" });
        }
    }

    // Получение одной задачи по ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const task = await Task.findByPk(id, {
                include: [
                    { model: User, as: "assignedUser", attributes: ["id", "name", "surname", "email"] }
                ]
            });

            if (!task) {
                return res.status(404).json({ error: "Задача не найдена" });
            }
            res.json(task);
        } catch (error) {
            console.error("Ошибка при получении задачи:", error);
            res.status(500).json({ error: "Ошибка при получении задачи" });
        }
    }

    // Создание новой задачи
    async create(req, res) {
        try {
            const { description, status, comment, assigned_to } = req.body;
            
            if (!description || !assigned_to) {
                return res.status(400).json({ error: "Описание задачи и ID назначенного пользователя обязательны" });
            }

            // Проверяем, существует ли пользователь, которому назначается задача
            const assignedUser = await User.findByPk(assigned_to);
            if (!assignedUser) {
                return res.status(404).json({ error: "Назначенный пользователь не найден" });
            }

            const task = await Task.create({ description, status, comment, assigned_to });
            await analyticsController.updateAnalytics();
            res.status(201).json(task);
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
            res.status(500).json({ error: "Ошибка при создании задачи" });
        }
    }

    // Обновление задачи
    async update(req, res) {
        try {
            const { id } = req.params;
            const { description, status, comment, assigned_to } = req.body;
            const task = await Task.findByPk(id);

            if (!task) {
                return res.status(404).json({ error: "Задача не найдена" });
            }

            // Проверяем, если assigned_to передан, существует ли пользователь
            if (assigned_to) {
                const assignedUser = await User.findByPk(assigned_to);
                if (!assignedUser) {
                    return res.status(404).json({ error: "Назначенный пользователь не найден" });
                }
            }

            await task.update({ description, status, comment, assigned_to });
            await analyticsController.updateAnalytics();
            res.json({ message: "Задача обновлена", task });
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
            res.status(500).json({ error: "Ошибка при обновлении задачи" });
        }
    }

    // Удаление задачи
    async delete(req, res) {
        try {
            const { id } = req.params;
            const task = await Task.findByPk(id);

            if (!task) {
                return res.status(404).json({ error: "Задача не найдена" });
            }

            await task.destroy();
            await analyticsController.updateAnalytics();
            res.json({ message: "Задача удалена" });
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
            res.status(500).json({ error: "Ошибка при удалении задачи" });
        }
    }
}

module.exports = new TaskController();
