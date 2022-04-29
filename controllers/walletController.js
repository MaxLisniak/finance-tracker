const Wallet = require("../models/wallet")

exports.index = function(req, res, next){
    // Find all wallet objects
    Wallet.find()
    // Sort by 'created' field in ascending order
    .sort([['created', 'ascending']])
    .exec(function (err, wallet_list){
        // If error
        if (err) {
            return next(err);
        }
        // If success
        res.render('index', { title: "All wallets", wallets: wallet_list});
    });
    
};