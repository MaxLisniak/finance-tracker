var express = require('express');
var router = express.Router();

let wallet_controller = require('../controllers/walletController');

router.get('/', wallet_controller.index);

module.exports = router;
