const { DateTime } = require("luxon");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let WalletSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            maxlength: 20,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        type: {
            type: String,
            enum: ['Card', 'Cash'],
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
            required: true,
        }
    }
);

//Export model
module.exports = mongoose.model('Wallet', WalletSchema);