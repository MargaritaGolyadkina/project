const { User, Role } = require("../models/models"); // Импортируем модель Role
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id, email, role_id) => {
    return jwt.sign({ id, email, role_id }, "SECRET_KEY", { expiresIn: "24h" });
};

class UserController {
    async getAll(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении списка пользователей" });
        }
    }
    async getProfile(req, res) {
        try {
            const { id } = req.user; // Используем данные пользователя из токена
            const user = await User.findByPk(id, {
                include: [{ model: Role, attributes: ['name'] }] // Добавляем роль пользователя
            });
    
            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
    
            res.json(user); // Отправляем данные пользователя в ответ
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
        }
    }
    
    
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении пользователя' });
        }
    }

    async signUp(req, res) {
        try {
            const { name, surname, email, password, role_id } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const newUser = await User.create({
                name,
                surname,
                email,
                password: hashedPassword,
                role_id
            });

            const token = generateToken(newUser.id, newUser.email, newUser.role_id);
            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ error: "Ошибка при регистрации пользователя" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: "Неверный email или пароль" });
            }

            const token = generateToken(user.id, user.email, user.role_id);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: "Ошибка при авторизации" });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, surname, email, password, role_id } = req.body;
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
            await user.update({ name, surname, email, password: hashedPassword, role_id });
            res.json({ message: 'Пользователь обновлен', user });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            await user.destroy();
            res.json({ message: 'Пользователь удален' });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении пользователя' });
        }
    }

    async getEmployees(req, res) {
        try {
            const employees = await User.findAll({
                include: [{ model: Role, attributes: ['name'], where: { name: 'Сотрудник' } }]
            });

            if (!employees.length) {
                return res.status(404).json({ error: "Нет сотрудников с ролью 'Сотрудник'" });
            }

            res.json(employees);
        } catch (error) {
            console.error("Ошибка при получении сотрудников:", error);
            res.status(500).json({ error: "Ошибка при получении данных" });
        }
    }

    async getAdmins(req, res) {
        try {
            const admins = await User.findAll({
                include: [{ model: Role, attributes: ['name'], where: { name: 'Администратор' } }]
            });

            if (!admins.length) {
                return res.status(404).json({ error: "Нет пользователей с ролью 'Администратор'" });
            }

            res.json(admins);
        } catch (error) {
            console.error("Ошибка при получении администраторов:", error);
            res.status(500).json({ error: "Ошибка при получении данных" });
        }
    }

    async getManagers(req, res) {
        try {
            const managers = await User.findAll({
                include: [{ model: Role, attributes: ['name'], where: { name: 'Руководитель' } }]
            });

            if (!managers.length) {
                return res.status(404).json({ error: "Нет пользователей с ролью 'Руководитель'" });
            }

            res.json(managers);
        } catch (error) {
            console.error("Ошибка при получении руководителей:", error);
            res.status(500).json({ error: "Ошибка при получении данных" });
        }
    }
}

module.exports = new UserController();
