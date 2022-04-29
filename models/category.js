var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 20,
        },
    }
)

module.exports = mongoose.model('Category', CategorySchema);