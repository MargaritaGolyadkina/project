require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routers/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const app = express();

// Разрешаем CORS
app.use(cors());
app.use(express.json());

// Создаем папку uploads, если её нет
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка хранилища для изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Папка для хранения изображений
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Имя файла = текущему времени + расширение
    }
});

// Создаем экземпляр multer
const upload = multer({ storage });

// Раздача загруженных файлов (чтобы фронтенд мог их загружать)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Основные маршруты API
app.use('/api', router);

// Роут для загрузки фотографий
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
        message: 'Image uploaded successfully', 
        fileUrl: `/uploads/${req.file.filename}` // Отправляем путь к файлу
    });
});

// Обработчик ошибок (должен быть последним middleware)
app.use(errorHandler);

// Запуск сервера
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
