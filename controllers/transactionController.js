const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const Category = require("../models/category");
const async = require('async');

const { body,validationResult } = require('express-validator');
const transaction_types = require('../consts');


exports.transaction_add_GET = function (req, res, next){
    Wallet.findById(req.params.id)
    .exec(function(err, wallet){
        if (err){
            err.status = 404;
            return next(err);
        }
        res.render('transaction_make',{
            title: transaction_types.add.title,
        })
    });
}

exports.transaction_add_POST = [
    body('description')
    .trim()
    .escape(),

    body('amount')
    .isInt({
        min: 1
    })
    .withMessage("The number must be greater than 0"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('transaction_make', {
                title: transaction_types.add.title,
                description: req.body.description,
                errors: errors.array()
            })
            return;
        }
        async.parallel({
            earned_wallet: function(callback){
                Wallet.findOne({'name': "EARNED"}).exec(callback)
            },
            target_wallet: function(callback){ 
                Wallet.findById(req.params.id).exec(callback)
            }
        }, function (err, results){
                if(err){
                    return next(err);
                }
                req.body.amount = Number(req.body.amount);
                let transaction = new Transaction(
                    {
                        type: transaction_types.add.short,
                        description: req.body.description,
                        amount: req.body.amount,
                        to: results.target_wallet._id,
                        from: results.earned_wallet._id,
                    }
                )
                // console.log(transaction);
                results.target_wallet.balance += req.body.amount;
                results.target_wallet.save(function(err){
                    if (err){
                        return next(err);
                    }
                })
                transaction.save(function(err){
                    if (err){
                        return next(err);
                    } 
                    res.redirect('/wallets');
                })
            }
        )
}]  

exports.transaction_spend_GET = function (req, res, next){
    Wallet.findById(req.params.id)
    .exec(function(err, wallet){
        if (err){
            err.status = 404;
            return next(err);
        }
        Category.find()
        .exec(function(err, categories){
            if (err){
                return next(err);
            }
            res.render('transaction_make',{
                title: transaction_types.spend.title,
                categories: categories,
            })
        })
    });
}

exports.transaction_spend_POST = [
    body('description')
    .trim()
    .escape(),

    body('amount')
    .isInt({
        min: 1
    })
    .withMessage("The number must be greater than 0"),

    body('category')
    .escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            Category.find()
            .exec(function(err, categories){
                res.render('transaction_make', {
                    title: transaction_types.add.title,
                    description: req.body.description,
                    errors: errors.array(),
                    selected_category: req.body.category,
                    categories: categories,
                })
            })
            return;
        }
        async.parallel({
            spent_wallet: function(callback){
                Wallet.findOne({'name': "SPENT"}).exec(callback)
            },
            target_wallet: function(callback){ 
                Wallet.findById(req.params.id).exec(callback)
            }
        }, function (err, results){
                if(err){
                    return next(err);
                }
                req.body.amount = Number(req.body.amount);
                let transaction = new Transaction(
                    {
                        type: transaction_types.spend.short,
                        description: req.body.description,
                        amount: req.body.amount,
                        category: req.body.category,
                        from: results.target_wallet._id,
                        to: results.spent_wallet._id,
                    }
                )
                // console.log(transaction);
                results.target_wallet.balance -= req.body.amount;
                results.target_wallet.save(function(err){
                    if (err){
                        return next(err);
                    }
                })
                transaction.save(function(err){
                    if (err){
                        return next(err);
                    } 
                    res.redirect('/wallets');
                })
            }
        )
}]  

exports.transaction_move_GET = function (req, res, next){
    Wallet.findById(req.params.id)
    .exec(function(err, wallet){
        if (err){
            err.status = 404;
            return next(err);
        }
        Wallet.find({
            "type": {
                "$ne": "Service"
            }
        })
        // .where('name').ne('EARNED')
        .exec(function(err, wallets){
            if (err){
                return next(err);
            }
            res.render('transaction_make',{
                title: transaction_types.move.title,
                wallets: wallets,
            })
        })
    });
}
