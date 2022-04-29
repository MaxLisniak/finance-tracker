var express = require('express');
var router = express.Router();

let wallet_controller = require('../controllers/walletController');


router.get('/', wallet_controller.index);

router.get('/add_wallet', wallet_controller.wallet_add_GET);
router.post('/add_wallet', wallet_controller.wallet_add_POST);

module.exports = router;