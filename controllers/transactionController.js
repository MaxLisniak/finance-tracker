const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const Category = require("../models/category");

const { body,validationResult } = require('express-validator');
var async = require('async');

exports.transaction_add_GET = function (req, res, next){
    title = "Add money";
    Wallet.findById(req.params.id)
    .exec(function(err, wallet){
        if (err){
            err.status = 404;
            return next(err);
        }
        res.render('transaction_make',{
            title: title,
            wallet: wallet,
        })
    });
}

exports.transaction_spend_GET = function (req, res, next){
    title = "Spend money";
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
                title: title,
                wallet: wallet,
                categories: categories,
            })
        })
    });
}

exports.transaction_move_GET = function (req, res, next){
    title = "Move money";
    Wallet.findById(req.params.id)
    .exec(function(err, wallet){
        if (err){
            err.status = 404;
            return next(err);
        }
        Wallet.find({
            "name": {
                "$nin": ["SPENT", "EARNED"]
            }
        })
        // .where('name').ne('EARNED')
        .exec(function(err, wallets){
            if (err){
                return next(err);
            }
            res.render('transaction_make',{
                title: title,
                wallet: wallet,
                wallets: wallets,
            })
        })
    });
}

exports.transaction_make_GET = function(req, res, next){
    Category.find()
    .exec(function(err, categories){
        if (err) {
            return next(err);
        }
        let type = req.query.type;
        let title;
        if (type === 'in'){
            title = "Add money";
        } else if (type === 'out'){
            title = "Spend money";
        } else if (type === 'move'){
            title = "Move money";
        } else {
            var err = new Error('Wrong request');
            err.status = 404;
            return next(err);
        }
        Wallet.findById(req.query.id)
        .exec(function(err, wallet){
            if (err) { 
                err.status = 404;
                return next(err);
            }
        })
        res.render('transaction_make', {
            title: title,
            categories: categories,
            transaction_type: type,
            wallet_id: req.query.id,
        })
    })
}

exports.transaction_make_POST = [
    body('amount')
    .escape(),

    body('description')
    .trim()
    .escape(),

    body('category')
    .trim()
    .escape(),

    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        let transaction = new Transaction(
            {
                type: req.body.type,
                description: req.body.description,
                amount: req.body.amount,
            }
        )
        console.log(transaction);
        if (!errors.isEmpty()) {
            let type = req.body.type;
            let title;
            if (type === 'in'){
                title = "Add money";
            } else if (type === 'out'){
                title = "Spend money";
            } else if (type === 'move'){
                title = "Move money";
            }
            Category.find()
            .exec(function (err, categories){
                if (err) {
                    return next(err);
                }
                res.render('transaction_make', {
                    title: title,
                    categories: categories,
                    transaction_type: type,
                    wallet_id: req.body.from | req.body.to,
                })
            })
            return;
        };
        
        if (req.body.type === 'in') {
            transaction.to = req.body.to;
            // transaction.from = null;
            transaction.save(function(err){
                if (err) {
                    console.log('woops');
                    return next(err);
                }
                Wallet.findById(req.body.to)
                .exec(function(err, wallet){
                    if (err){
                        next(err);
                    }
                    wallet.balance += req.body.amount;
                    wallet.save(function(err){
                        if (err){
                            next(err);
                        }
                    })
                })
            })
        }
        else if (req.body.type === 'out') {
            transaction.from = req.body.from;
            transaction.to = req.body.to;
            transaction.save(function(err){
                if (err) {
                    return next(err);
                }
                Wallet.findById(req.body.from)
                .exec(function(err, wallet){
                    if (err){
                        next(err);
                    }
                    wallet.balance -= req.body.amount;
                    wallet.save(function(err){
                        if (err){
                            next(err);
                        }
                    })
                })
            })
        }
        res.redirect('/');
    }

]