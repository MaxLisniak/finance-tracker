const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const Category = require("../models/category");
const async = require('async');

const { body,validationResult } = require('express-validator');
const transaction_types = require('../consts');


// exports.transaction_add_GET = function (req, res, next){
//     Wallet.findById(req.params.id)
//     .exec(function(err, wallet){
//         if (err){
//             err.status = 404;
//             return next(err);
//         }
//         res.render('transaction_make',{
//             title: transaction_types.add.title,
//         })
//     });
// }

//USED
exports.transaction_categories_GET = function (req, res, next){
    
    Category.find()
    .exec(function(err, categories){
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.status(200).json(categories);
    })
}

// USED
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
            res.json(errors.array());
            return
        }
        async.parallel({
            earned_wallet: function(callback){
                Wallet.findOne({'name': "EARNED"}).exec(callback)
            },
            target_wallet: function(callback){ 
                Wallet.findById(req.params.id).exec(callback)
            }
        }, function (err, results){
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
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
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                })
                results.earned_wallet.balance += req.body.amount;
                results.earned_wallet.save(function(err){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                })
                transaction.save(function(err){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    res.status(200).json({success: true});
                    return;
                })
                
            }
        )
}]  


// USED
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
    .trim()
    .escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors.array());
            return
        }
        async.parallel({
            spent_wallet: function(callback){
                Wallet.findOne({'name': "SPENT"}).exec(callback)
            },
            target_wallet: function(callback){ 
                Wallet.findById(req.params.id).exec(callback)
            }
        }, function (err, results){
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
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
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                });
                results.spent_wallet.balance += req.body.amount;
                results.spent_wallet.save(function(err){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                })
                transaction.save(function(err){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    res.status(200).json({success: true});
                    return;
                })
            }
        )
}]  

// exports.transaction_move_GET = function (req, res, next){
//     Wallet.findById(req.params.id)
//     .exec(function(err, wallet){
//         if (err){
//             err.status = 404;
//             return next(err);
//         }
//         Wallet.find({
//             "type": {
//                 "$ne": "Service"
//             }
//         })
//         .exec(function(err, wallets){
//             if (err){
//                 return next(err);
//             }
//             res.render('transaction_make',{
//                 title: transaction_types.move.title,
//                 wallets: wallets,
//             })
//         })
//     });
// }

// USED
exports.transaction_move_POST = [
    body('description')
    .trim()
    .escape(),

    body('amount')
    .isInt({
        min: 1
    })
    .withMessage("The number must be greater than 0"),

    body('target_wallet')
    .trim()
    .escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors.array());
            return;
            
        }
        async.parallel({
            this_wallet: function(callback){
                Wallet.findById(req.params.id).exec(callback)
            },
            target_wallet: function(callback){ 
                Wallet.findById(req.body.target_wallet).exec(callback)
            }
        }, function (err, queried_wallets){
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                req.body.amount = Number(req.body.amount);
                let transaction = new Transaction(
                    {
                        type: transaction_types.move.short,
                        description: req.body.description,
                        amount: req.body.amount,
                        to: queried_wallets.target_wallet._id,
                        from: queried_wallets.this_wallet._id,
                    }
                )
                // console.log(transaction);
                queried_wallets.target_wallet.balance += req.body.amount;
                queried_wallets.target_wallet.save(function(err){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                })

                queried_wallets.this_wallet.balance -= req.body.amount;
                queried_wallets.this_wallet.save(function(err){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                })

                transaction.save(function(err){
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    res.status(200).json({success: true});
                    return;
                })
            }
        )
}]
