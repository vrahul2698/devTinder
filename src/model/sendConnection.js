const mongoose = require("mongoose")


const sendConnectionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["accepted", "ignored", "interested", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {
        timestamps: true
    });


sendConnectionSchema.index({ fromUserId: 1, toUserId: 1 })


sendConnectionSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest?.fromUserId?.equals(connectionRequest?.toUserId)) {
        throw new Error("Cannot Send connection to yourself")
    }
    next()
})

module.exports = mongoose.model("sendConnection", sendConnectionSchema)