const Router = require('express').Router;
const router = new Router();
const analyticsController = require('../controllers/analytics_controller');

router.post('/update-and-get', async (req, res) => { 
    try {
        await analyticsController.updateAnalytics(); // Сначала обновляем аналитику
        const analyticsData = await analyticsController.getAllData(); // Затем получаем обновленные данные
        res.json(analyticsData);
    } catch (error) {
        console.error("Ошибка при обновлении и получении аналитики:", error);
        res.status(500).json({ error: "Ошибка при обновлении и получении аналитики" });
    }
});

module.exports = router;
