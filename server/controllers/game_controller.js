const { User } = require('../models/models');



// Добавить очки пользователю
exports.addScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        user.score = (user.score || 0) + parseInt(score, 10);
        await user.save();

        res.json({ message: 'Очки добавлены', newScore: user.score });
    } catch (error) {
        console.error('Ошибка при добавлении очков:', error);
        res.status(500).json({ error: 'Не удалось добавить очки' });
    }
};
