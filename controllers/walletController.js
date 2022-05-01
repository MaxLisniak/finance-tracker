const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const Category = require("../models/category");

const { body,validationResult } = require('express-validator');
var async = require('async');

async function earned_balance_count(wallet){
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    let balance = 0;
    if (wallet.name === "EARNED") {
        const transactions = await Transaction.find(
            {
                "$and" : [
                    {from: wallet._id},
                    {datetime: {
                        "$gt": firstDay
                    }
                    }
                ]
            }
        ).select('amount').exec();
        // console.log(transactions);
        for (let transaction of transactions){
            balance += transaction.amount;
        };
        return balance;
    }
    
}

exports.index = function(req, res, next){
    // Find all wallet objects
    async.parallel({
        wallets: function(callback){
            Wallet.find({
                name: {
                    "$nin": ["EARNED", "SPENT"]
                }
            })
            // Sort by 'created' field in ascending order
            .sort([['created', 'ascending']])
            .exec(callback);
        },
        earned: function(callback){
            Wallet.findOne({name: "EARNED"})
            .exec(callback);
        },
        spent: function(callback){
            Wallet.findOne({name: "SPENT"})
            .exec(callback);
        }
    }, function(err, results){
        if (err){
            err.status = 404;
            return next(err);
        }
        res.render(
            'index', 
            { 
                title: "All wallets", 
                wallets: results.wallets,
                earned: results.earned,
                spent: results.spent,
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
        if (results.wallet===undefined) {
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