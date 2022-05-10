var express = require('express');
var router = express.Router();

let wallet_controller = require('../controllers/walletController');
let transaction_controller = require('../controllers/transactionController');


router.get('/wallet/:id', wallet_controller.wallet_view)
// router.get('/add_wallet', wallet_controller.wallet_add_GET);
// router.post('/add_wallet', wallet_controller.wallet_add_POST);
router.get('/transaction_categories', transaction_controller.transaction_categories_GET);
router.post('/add_to/:id', transaction_controller.transaction_add_POST);
router.post('/spend_from/:id', transaction_controller.transaction_spend_POST);

// router.get('/make_transaction/spend/:id', transaction_controller.transaction_spend_GET);
router.post('/make_transaction/spend/:id', transaction_controller.transaction_spend_POST);
router.get('/make_transaction/move/:id', transaction_controller.transaction_move_GET);
router.post('/make_transaction/move/:id', transaction_controller.transaction_move_POST);

router.get('/', wallet_controller.index);

module.exports = router;