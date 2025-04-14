const Router = require('express');
const router = new Router();
const PermissionController = require('../controllers/permission_controller');

router.get('/getall', PermissionController.getAll); // Получение списка всех прав
router.get('/getone/:id', PermissionController.getOne); // Получение одного права
router.post('/create', PermissionController.create); // Создание нового права
router.put('/update/:id', PermissionController.update); // Обновление права
router.delete('/delete/:id', PermissionController.delete); // Удаление права

module.exports = router;
