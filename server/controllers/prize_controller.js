const { Prize } = require("../models/models");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Настройки для multer: сохранение в папку "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "..", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерируем уникальное имя файла
    },
});

const upload = multer({ storage });

// Контроллер
class PrizeController {
    // Получение всех призов
    async getAll(req, res) {
        try {
            const { user_id } = req.query;
            const whereClause = user_id ? { assigned_to: user_id } : {};
            const prizes = await Prize.findAll({ where: whereClause });

            return res.json(prizes);
        } catch (error) {
            console.error("Ошибка при получении призов:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // Получение одного приза
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const prize = await Prize.findByPk(id);

            if (!prize) {
                return res.status(404).json({ message: "Приз не найден" });
            }

            return res.json(prize);
        } catch (error) {
            console.error("Ошибка при получении приза:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // Создание приза с загрузкой фото
    async create(req, res) {
        try {
            const { description, level, date_awarded, user_id } = req.body;
            const photo = req.file ? `/uploads/${req.file.filename}` : null;

            if (!description) {
                return res.status(400).json({ message: "Описание обязательно" });
            }

            const newPrize = await Prize.create({
                description,
                level,
                date_awarded,
                assigned_to: user_id || null,
                photo,
            });

            return res.status(201).json(newPrize);
        } catch (error) {
            console.error("Ошибка при создании приза:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // Обновление приза
    async update(req, res) {
        try {
            const { id } = req.params;
            const { description, level, date_awarded, user_id } = req.body;
            const photo = req.file ? `/uploads/${req.file.filename}` : null;

            const prize = await Prize.findByPk(id);
            if (!prize) {
                return res.status(404).json({ message: "Приз не найден" });
            }

            await prize.update({
                description: description || prize.description,
                level: level || prize.level,
                date_awarded: date_awarded || prize.date_awarded,
                assigned_to: user_id || prize.assigned_to,
                photo: photo || prize.photo,
            });

            return res.json({ message: "Приз обновлен", prize });
        } catch (error) {
            console.error("Ошибка при обновлении приза:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // Удаление приза
    async delete(req, res) {
        try {
            const { id } = req.params;
            const prize = await Prize.findByPk(id);

            if (!prize) {
                return res.status(404).json({ message: "Приз не найден" });
            }

            // Удаляем фото, если оно есть
            if (prize.photo) {
                const photoPath = path.join(__dirname, "..", prize.photo);
                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            }

            await prize.destroy();
            return res.json({ message: "Приз удален" });
        } catch (error) {
            console.error("Ошибка при удалении приза:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // Назначение приза пользователю
    async assignPrize(req, res) {
        try {
            const { id } = req.params;
            const { user_id } = req.body;

            const prize = await Prize.findByPk(id);
            if (!prize) {
                return res.status(404).json({ message: "Приз не найден" });
            }

            await prize.update({ assigned_to: user_id });

            return res.json({ message: "Приз назначен пользователю", prize });
        } catch (error) {
            console.error("Ошибка при назначении приза:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // Управление призами (метод manage)
    async manage(req, res) {
        try {
            // Логика для управления призами
            // Здесь вы можете добавить логику, которая будет отвечать за редактирование, удаление или другие действия с призами

            // Пример: Получаем все призы для управления
            const prizes = await Prize.findAll();
            
            // Допустим, выводим все призы с возможностью редактировать или удалять
            res.json({
                message: "Управление призами",
                prizes,
            });
        } catch (error) {
            console.error("Ошибка при управлении призами:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}



module.exports = {
    prizeController: new PrizeController(),
    upload,
};
