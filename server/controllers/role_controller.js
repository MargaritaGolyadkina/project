const { Role } = require("../models/models");

class RoleController {
    // Получение списка всех ролей
    async getAll(req, res) {
        try {
            const roles = await Role.findAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении списка ролей" });
        }
    }

    // Получение одной роли по ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);

            if (!role) {
                return res.status(404).json({ error: "Роль не найдена" });
            }

            res.json(role);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении роли" });
        }
    }

    // Создание новой роли
    async create(req, res) {
        try {
            const { name } = req.body; 
            const role = await Role.create({ name }); 

            res.status(201).json(role);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при создании роли" });
        }
    }

    // Обновление роли по ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body; 
            const role = await Role.findByPk(id);

            if (!role) {
                return res.status(404).json({ error: "Роль не найдена" });
            }

            await role.update({ name });
            res.json({ message: "Роль обновлена", role });
        } catch (error) {
            res.status(500).json({ error: "Ошибка при обновлении роли" });
        }
    }

    // Удаление роли по ID
    async delete(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);

            if (!role) {
                return res.status(404).json({ error: "Роль не найдена" });
            }

            await role.destroy();
            res.json({ message: "Роль удалена" });
        } catch (error) {
            res.status(500).json({ error: "Ошибка при удалении роли" });
        }
    }
}

module.exports = new RoleController();
