const { DateTime } = require('luxon');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const consts = {
    income: 'i',
    outcome: 'o',
}

let TransactionSchema = new Schema(
    {
        type: {
            type: String,
            enum: [consts.income, consts.outcome],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
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
        }
    }
)

//Export model
module.exports = mongoose.model('Transaction', TransactionSchema);