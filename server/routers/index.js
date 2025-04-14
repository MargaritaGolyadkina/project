const Router = require('express').Router;
const router = new Router();

const user = require('./user_router');
const prize = require('./prize_router');
const task = require('./task_router');

const analytics = require('./analytics_router');
const role = require('./role_router');
const permission = require('./permission_router');

const salaryRoutes = require('./salary_router');

router.use('/salary', salaryRoutes);
router.use('/user', user);
router.use('/prize', prize);
router.use('/task', task);

router.use('/analytics', analytics);
router.use('/role', role);
router.use('/permission', permission);


module.exports = router;
