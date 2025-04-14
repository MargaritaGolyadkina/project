const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salary_controller');

// Создание или обновление зарплаты
router.post('/create', salaryController.createOrUpdateSalary);

// Получение всех зарплат (например, для администратора)
router.get('/getall', salaryController.getAllSalaries);

// Получение зарплат по user_id
router.get('/user/:userId', salaryController.getSalaryByUser);

// Удаление зарплаты по ID
router.delete('delete/:id', salaryController.deleteSalary);

module.exports = router;
