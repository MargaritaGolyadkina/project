const express = require('express');
const router = express.Router();
const GameController = require('../controllers/game_controller');

router.post('/:id/score', GameController.addScore);

module.exports = router;
