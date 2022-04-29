const Wallet = require("../models/wallet");
const { body,validationResult } = require('express-validator');

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
        res.render(
            'index', 
            { 
                title: "All wallets", 
                wallets: wallet_list
            }
        );
    });

};

exports.wallet_add_GET = function(req, res, next){
    res.render(
        'wallet_add', 
        { 
            title: "Add a digital wallet",
        }
    );
};

exports.wallet_add_POST = [
    // Validate and sanitize fields
    body('name', 'Name must be specified')
    .trim()
    .isLength({min: 1})
    .escape(),

    body('type', 'Type must be specified')
    .trim()
    .escape(),

    // After validation
    (req, res, next) => {
        //Validation errors 
        const errors = validationResult(req);

        let new_wallet = new Wallet(
            {
                name: req.body.name,
                type: req.body.type,
            }
        );

        // If there are validation errors
        if (!errors.isEmpty()){
            res.render(
                'wallet_add', 
                { 
                    title: "Add a digital wallet",
                    errors: errors.array(),
                }
            );
        }
        // Data is valid
        else {
            Wallet.findOne({'name': req.body.name})
            .exec(function (err, found_wallet) {
                if(err) {
                    return next(err);
                }

                // Such a wallet already exists
                if (found_wallet){
                    res.redirect(found_wallet.url);
                }
                else {
                    new_wallet.save(function (err){
                        if (err) {
                            return next(err);
                        }
                        res.redirect(new_wallet.url);
                    })
                }

            })
        }
    }

]