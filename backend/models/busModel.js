const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const busSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    busTime: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    durationTime: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    busDate: {
        type: String,
        required: true
    },
    seats: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);