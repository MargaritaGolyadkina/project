const Router = require('express').Router;
const router = new Router();
const requestController = require('../controllers/request_controller');

router.get('/getall', requestController.getAll);
router.get('/getone/:id', requestController.getOne);
router.post('/create', requestController.create);
router.put('/update/:id', requestController.update);
router.delete('/delete/:id', requestController.delete);

module.exports = router;
