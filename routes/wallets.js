var express = require('express');
var router = express.Router();

let wallet_controller = require('../controllers/walletController');
let transaction_controller = require('../controllers/transactionController');


router.post('/add_to/:id', transaction_controller.transaction_add_POST);
router.post('/spend_from/:id', transaction_controller.transaction_spend_POST);
router.post('/move_from/:id', transaction_controller.transaction_move_POST);
router.get('/transaction_categories', transaction_controller.transaction_categories_GET);
router.get('/wallet/:id', wallet_controller.wallet_view)
router.get('/accessible/:id', wallet_controller.accessible_wallets_GET);
router.get('/', wallet_controller.wallets_GET);
router.post('/', wallet_controller.wallet_add_POST);


module.exports = router;