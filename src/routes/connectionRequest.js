const express = require("express");
const ConnectionRequest = require("../model/sendConnection");
const { AuthSignin } = require("../middlewares/auth");
const User = require("../model/user");
const connectionRouter = express.Router();
const sendEmail = require("../utils/sendEmail")


connectionRouter.post("/request/send/:status/:toUserId", AuthSignin, async (req, res) => {
    try {
        const fromUserId = req.user?._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus?.includes(status)) {
            return res.status(400).json({ message: "Invalid Status " + status })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection Request Already Sent " + status })

        }

        const toUserData = await User.findById(toUserId);
        if (!toUserData) {
            return res.status(400).json({ message: "User Not found" })

        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });

        const result = await connectionRequest.save();
        const emailRes = await sendEmail.run("you have an new Friend Request "+req.user.firstName , req.user.firstName + status + " " + toUserData?.firstName,);
        console.log(emailRes, "emailRes")

        res.json({ message: req.user.firstName + status + " " + toUserData?.firstName, result: result })

    }
    catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }
})


connectionRouter.post("/request/review/:status/:requestId", AuthSignin, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not valid" })
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser?._id,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(400).json({ message: "Connection Request Not Found..!!" })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: `Connection ${status} Successfully`, data })


    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

module.exports = connectionRouter