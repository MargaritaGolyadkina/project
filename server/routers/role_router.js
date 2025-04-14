const Router = require('express');
const router = new Router();
const RoleController = require('../controllers/role_controller');

router.get('/getall', RoleController.getAll); // Получение списка всех ролей
router.get('/getone/:id', RoleController.getOne); // Получение одной роли
router.post('/create', RoleController.create); // Создание новой роли
router.put('/update/:id', RoleController.update); // Обновление роли
router.delete('/delete/:id', RoleController.delete); // Удаление роли

module.exports = router;
