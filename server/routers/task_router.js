const Router = require('express').Router;
const router = new Router();
const taskController = require('../controllers/task_controller');

router.get('/getall', taskController.getAll);
router.get('/getone/:id', taskController.getOne);
router.post('/create', taskController.create);
router.put('/update/:id', taskController.update);
router.delete('/delete/:id', taskController.delete);

module.exports = router;
