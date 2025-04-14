const Router = require('express');
const router = new Router();
const RolePermissionController = require('../controllers/role_permission_Controller');

// Назначение права роли
router.post('/assign/:roleId/:permissionId', RolePermissionController.assignPermission);

// Удаление права у роли
router.delete('/remove/:roleId/:permissionId', RolePermissionController.removePermission);

// Получение всех прав для роли
router.get('/permissions/:roleId', RolePermissionController.getPermissionsByRole);

// Получение всех ролей для права
router.get('/roles/:permissionId', RolePermissionController.getRolesByPermission);

module.exports = router;
