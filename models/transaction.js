const { DateTime } = require('luxon');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const transaction_types = require('../consts');


let TransactionSchema = new Schema(
    {
        type: {
            type: String,
            enum: [
                transaction_types.add.short, 
                transaction_types.spend.short, 
                transaction_types.move.short
            ],
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
        },
        description: {
            type: String,
            required: false,
            default: "",
        }
    }
)

TransactionSchema
.virtual('datetime_formatted')
.get(function(){
  return this.datetime ? 
    DateTime.fromJSDate(this.datetime)
    .toLocaleString(DateTime.DATETIME_MED) : 
    '';
});

//Export model
module.exports = mongoose.model('Transaction', TransactionSchema);