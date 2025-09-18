const express = require('express');
const { AuthSignin } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require("../model/sendConnection");
const User = require("../model/user");

const USER_COMMON_DATA = "firstName lastName skills photoUrl age gender about"

userRouter.get("/user/requests", AuthSignin, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_COMMON_DATA)

        res.json({ message: "Data fetched successfully", data: connectionRequests })
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
});


userRouter.get("/user/connections", AuthSignin, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_COMMON_DATA).populate("toUserId", USER_COMMON_DATA);

        const data = connectionRequests.map(data => {
            if (data?.fromUserId._id.toString() === loggedInUser._id?.toString()) {
                return data?.toUserId;
            }
            return data?.fromUserId
        }
        )



        res.json({ message: "Data Fetched Successfully", data })

    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

userRouter.get("/user/feed", AuthSignin, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;


        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser?._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        const restrictedUsers = new Set();
        connectionRequests.forEach((data) => {
            restrictedUsers.add(data?.fromUserId.toString());
            restrictedUsers.add(data?.toUserId.toString());
        })

        // console.log(restrictedUsers, "restrictedUsers")

        const users = await User.find({
            $and: [{
                _id: { $nin: Array.from(restrictedUsers) }
            },
            { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_COMMON_DATA).skip(skip).limit(limit)

        res.send(users)
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})


module.exports = userRouter