const { Analytics, Task } = require("../models/models");

class AnalyticsController {
    async getAllData() {
        try {
            const analyticsData = await Analytics.findAll();
            return analyticsData;
        } catch (error) {
            console.error("Ошибка при получении аналитики:", error);
            throw error;
        }
    }
    
    async getAll(req, res) {
        try {
            const analyticsData = await Analytics.findAll();
            if (!analyticsData.length) {
                return res.status(404).json({ error: "Нет данных для аналитики" });
            }
            res.json(analyticsData);
        } catch (error) {
            console.error("Ошибка при получении аналитики:", error);
            res.status(500).json({ error: "Ошибка при получении данных" });
        }
    }

    async updateAnalytics() {
        try {
            const counts = await Task.findAll({
                attributes: ["status", [Task.sequelize.fn("COUNT", "*"), "count"]],
                group: ["status"],
                raw: true,
            });

            let analyticsData = {
                created_count: 0,
                in_progress_count: 0,
                review_count: 0,
                completed_count: 0,
                incorrect_count: 0,
            };

            counts.forEach(({ status, count }) => {
                switch (status) {
                    case "создана":
                        analyticsData.created_count = count;
                        break;
                    case "в работе":
                        analyticsData.in_progress_count = count;
                        break;
                    case "на проверке":
                         analyticsData.review_count = count;   
                    case "выполнена":
                        analyticsData.completed_count = count;
                        break;
                    case "выполнено не верно":
                        analyticsData.incorrect_count = count;
                        break;
                }
            });

            await Analytics.upsert({ id: 1, ...analyticsData });
            console.log("✅ Аналитика успешно обновлена");
        } catch (error) {
            console.error("❌ Ошибка при обновлении аналитики:", error);
        }
    }
}

module.exports = new AnalyticsController();