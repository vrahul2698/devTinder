const express = require("express");
const { AuthSignin } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../model/payment");
const { membershipAmount } = require("../utils/constants");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const User = require("../model/user");

paymentRouter.post("/payment/create", AuthSignin, async (req, res) => {
    try {
        const { membershipType } = req?.body;
        const { firstName, lastName, emailId } = req.user;
        const order = await razorpayInstance.orders.create({
            "amount": membershipAmount[membershipType] * 100, //paisa
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                firstName,
                lastName,
                membershipType,
                emailId
            }
        });

        // Save it in my Database
        const payment = new Payment({
            userId: req?.user?._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order?.receipt,
            notes: order.notes
        })
        const savedPayment = await payment.save();
        console.log(order, "order")

        // Return back my order details to frontend
        return res.status(200).json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID })
    }
    catch (err) {
        return res.status(500).json({ msg: err.message })
    }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        const webHoofSignature = req.get("X-Razorpay-Signature")
        const isWebHookValid = validateWebhookSignature(JSON.stringify(req?.body),
            webHoofSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET);

        if (!isWebHookValid) {
            return res.status(400).json({ msg: "Web hook is no valid" })
        }

        // Update my payment status in DB
        //update the user as premium

        // const 
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findOne({_id : payment.userId});
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        //return success response to razorpay
        // if (req.body.event === "payment.captured") {
        // }
        // if (req.body.event === "payment.failed") {
        // }

        res.status(200).json({ msg: "WebHook Recieved Successfully" })
    }
    catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

module.exports = paymentRouter;
