const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ticketSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    company: {
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
    busTime: {
        type: String,
        required: true
    },
    busDate: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    bookedNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);