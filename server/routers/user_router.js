const Router = require('express').Router;
const router = new Router();
const jwt = require('jsonwebtoken');
const userController = require('../controllers/user_controller');

// Маршрут для получения профиля пользователя с проверкой токена
router.get('/profile', async (req, res) => {
    try {
        // Берем токен из заголовка Authorization
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
        
        if (!token) {
            return res.status(401).json({ error: 'Токен не найден' });
        }

        // Проверка токена
        const decoded = jwt.verify(token, "SECRET_KEY");
        
        // Если токен валиден, передаем информацию о пользователе
        req.user = decoded;

        // Вызов контроллера для получения профиля
        return userController.getProfile(req, res);
    } catch (error) {
        return res.status(401).json({ error: 'Неверный или просроченный токен' });
    }
});

// Прочие маршруты
router.get('/getall', userController.getAll);
router.get('/getone/:id', userController.getOne);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.put('/update/:id', userController.update);
router.delete('/delete/:id', userController.delete);
router.get('/employees', userController.getEmployees);
router.get('/admins', userController.getAdmins);
router.get('/managers', userController.getManagers);

module.exports = router;
