const { Permission } = require('../models/models');

class PermissionController {
    // Получение всех прав
    async getAll(req, res) {
        try {
            const permissions = await Permission.findAll();
            res.json(permissions);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении списка прав' });
        }
    }

    // Получение одного права по ID
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const permission = await Permission.findByPk(id);

            if (!permission) {
                return res.status(404).json({ error: 'Право не найдено' });
            }

            res.json(permission);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении права' });
        }
    }

    // Создание нового права
    async create(req, res) {
        try {
            const { permission_name } = req.body;
            const newPermission = await Permission.create({ permission_name });

            res.status(201).json(newPermission);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при создании права' });
        }
    }

    // Обновление права
    async update(req, res) {
        try {
            const { id } = req.params;
            const { permission_name } = req.body;
            const permission = await Permission.findByPk(id);

            if (!permission) {
                return res.status(404).json({ error: 'Право не найдено' });
            }

            await permission.update({ permission_name });
            res.json({ message: 'Право обновлено', permission });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении права' });
        }
    }

    // Удаление права
    async delete(req, res) {
        try {
            const { id } = req.params;
            const permission = await Permission.findByPk(id);

            if (!permission) {
                return res.status(404).json({ error: 'Право не найдено' });
            }

            await permission.destroy();
            res.json({ message: 'Право удалено' });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении права' });
        }
    }
}

module.exports = new PermissionController();
