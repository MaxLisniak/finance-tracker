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
        },
        type: {
            type: String,
            enum: ['Card', 'Cash'],
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
        }
    }
);

//Export model
module.exports = mongoose.model('Wallet', WalletSchema);