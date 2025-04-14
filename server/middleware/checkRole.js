module.exports = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Пользователь не авторизован' });
        }
        
        console.log(`Проверка роли: ожидается ${role}, у пользователя ${req.user.role}`);

        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Доступ запрещен: недостаточно прав' });
        }

        next();
    };
};
