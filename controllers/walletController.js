const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const Category = require("../models/category");

const { body,validationResult } = require('express-validator');
var async = require('async');

// async function earned_balance_count(wallet){
//     const now = new Date();
//     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//     let balance = 0;
//     if (wallet.name === "EARNED") {
//         const transactions = await Transaction.find(
//             {
//                 "$and" : [
//                     {from: wallet._id},
//                     {datetime: {
//                         "$gt": firstDay
//                     }
//                     }
//                 ]
//             }
//         ).select('amount').exec();
//         // console.log(transactions);
//         for (let transaction of transactions){
//             balance += transaction.amount;
//         };
//         return balance;
//     }
    
// }

// USED
exports.wallets_GET = function(req, res, next){
    Wallet.find()
    .sort([['created', 'ascending']])
    .exec(function(err, wallets){
        if (err) {
            console.log(err);
            res.sendStatus(404);
            return;
        }
        return res.send(wallets);
    })
}

//USED
exports.accessible_wallets_GET =function(req, res, next){
    Wallet.find()
    .where("type").ne("Service")
    .where("_id").ne(req.params.id)
    // .where("id").ne(req.params.id)
    .sort([['created', 'descending']])
    .exec(function(err, wallets){
        if (err) {
            console.log(err);
            res.sendStatus(404);
            return;
        }
        return res.send(wallets);
    })
}

// exports.indexx = function(req, res, next){
//     // Find all wallet objects
//     async.parallel(
//         {
//             wallets: function(callback){
//                 Wallet.find({
//                     name: {
//                         "$nin": ["EARNED", "SPENT"]
//                     }
//                 })
//                 // Sort by 'created' field in ascending order
//                 .sort([['created', 'ascending']])
//                 .exec(callback);
//             },
//             earned: function(callback){
//                 Wallet.findOne({name: "EARNED"})
//                 .exec(callback);
//             },
//             spent: function(callback){
//                 Wallet.findOne({name: "SPENT"})
//                 .exec(callback);
//             }
//         }, 
//         function(err, queried_wallets){
//             if (err){
//                 err.status = 404;
//                 return next(err);
//             }
//             const now = new Date();
//             const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//             let earned = 0;
//             let spent = 0;
//             async.parallel({
//                 earned_transactions: function(callback){
//                     Transaction.find(
//                         {
//                             "$and" : [
//                                 {from: queried_wallets.earned._id},
//                                 {datetime: {
//                                     "$gt": firstDay
//                                 }
//                                 }
//                             ]
//                         }
//                         ).select('amount').exec(callback);
//                 },
//                 spent_transactions: function(callback){
//                     Transaction.find(
//                         {
//                             "$and" : [
//                                 {to: queried_wallets.spent._id},
//                                 {datetime: {
//                                     "$gt": firstDay
//                                 }
//                                 }
//                             ]
//                         }
//                         ).select('amount').exec(callback) 
//                 }
//             },function(err, transactions){
//                 if (err){
//                     return next(err);
//                 }

//                 for (let transaction of transactions.earned_transactions){
//                     earned += transaction.amount;
//                 };
//                 if (queried_wallets.earned.balance != earned){
//                     queried_wallets.earned.balance = earned;
//                     queried_wallets.earned.save(function(err){
//                         if (err){
//                             return next(err);
//                         }
//                     })
//                 }

//                 for (let transaction of transactions.spent_transactions){
//                     spent += transaction.amount;
//                 };
//                 if (queried_wallets.spent.balance != spent){
//                     queried_wallets.spent.balance = spent;
//                     queried_wallets.spent.save(function(err){
//                         if (err){
//                             return next(err);
//                         }
//                     })
//                 }

//                 res.render(
//                     'index', 
//                     { 
//                         title: "All wallets", 
//                         wallets: queried_wallets.wallets,
//                         earned: queried_wallets.earned,
//                         spent: queried_wallets.spent,
//                     }
//                 )
                
//             })
//         }
// )}

//USED
exports.wallet_view = function(req, res, next){
    async.parallel({
        // Find wallet
        wallet: function(callback){
            Wallet.findById(req.params.id)
            .exec(callback);
        },
        // Find income transactions
        incoming_transactions: function(callback){
            Transaction.find({'to': req.params.id})
            .sort([['datetime', 'descending']])
            .populate('from')
            .exec(callback);
        },
        // Find outcome transactions
        outgoing_transactions: function(callback){
            Transaction.find({'from': req.params.id})
            .sort([['datetime', 'descending']])
            .populate('category')
            .populate('to')
            .exec(callback);
        }
    }, function(err, results){
        // If error
        if (err) {
            return res.send({err: err});
        }
        // Wallet not found
        if (results.wallet===undefined) {
            var err = new Error('Wallet not found');
            err.status = 404;
            return res.send(err);
        }
        res.send(results);
    })
}

// exports.wallet_add_GET = function(req, res, next){
//     res.render(
//         'wallet_add', 
//         { 
//             title: "Add a digital wallet",
//         }
//     );
// };

//USED
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
            if (err) {
                console.log(err.array());
                res.sendStatus(500);
                return;
            }
        }
        // Data is valid
        else {
            Wallet.findOne({'name': req.body.name})
            .exec(function (err, found_wallet) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }

                // Such a wallet already exists
                if (found_wallet){
                    res.sendStatus(500);
                    return;
                }
                else {
                    new_wallet.save(function (err){
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                            return;
                        }
                        res.sendStatus(200);
                    })
                }

            })
        }
    }

]