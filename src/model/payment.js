const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        required: true
    },
    paymentId: {
        type: String,
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    notes: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        membershipType: {
            type: String,
            required: true
        },
    },

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema)