const { DateTime } = require('luxon');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const consts = {
    add: 'a',
    spend: 's',
    move: 'm',
}

let TransactionSchema = new Schema(
    {
        type: {
            type: String,
            enum: [consts.add, consts.spend, consts.move],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [1, "Enter the ammount greater than 0"],
        },
        from: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true,
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true,
        },
        datetime: {
            type: Date,
            default: Date.now,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: false,
            default: undefined,
        },
        description: {
            type: String,
            required: false,
            default: "",
        }
    }
)

//Export model
module.exports = mongoose.model('Transaction', TransactionSchema);