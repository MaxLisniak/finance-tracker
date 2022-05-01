const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const Category = require("../models/category");

const { body,validationResult } = require('express-validator');
var async = require('async');

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

exports.wallet_view = function(req, res, next){
    async.parallel({
        // Find wallet
        wallet: function(callback){
            Wallet.findById(req.params.id)
            .exec(callback);
        },
        // Find income transactions
        transactions_to: function(callback){
            Transaction.find({'from': req.params.id})
            .exec(callback);
        },
        // Find outcome transactions
        transactions_from: function(callback){
            Transaction.find({'to': req.params.id})
            .exec(callback);
        }
    }, function(err, results){
        // If error
        if (err) {
            return next(err);
        }
        // Wallet not found
        if (results.wallet==null) {
            var err = new Error('Wallet not found');
            err.status = 404;
            return next(err);
        }
        res.render(
            'wallet_view', 
            {
                title: results.wallet.name, 
                income: results.transactions_from, 
                outcome: results.transactions_to,
            }
        )
    })
}

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
                    wallet: new_wallet,
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
                    res.redirect('/');
                }
                else {
                    new_wallet.save(function (err){
                        if (err) {
                            return next(err);
                        }
                        res.redirect('/');
                    })
                }

            })
        }
    }

]