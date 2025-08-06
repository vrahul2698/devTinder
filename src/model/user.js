const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwttoken = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName: {
        type: "String"
    },
    lastName: {
        type: "String"
    },
    gender: {
        type: "String"
    },
    emailId: {
        type: "String"
    },
    password: {
        type: "String"
    },
    age: {
        type: "Number"
    },
});


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordCompare = await bcrypt.compare(passwordInputByUser, user?.password);
    return passwordCompare
}

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwttoken.sign({ _id: user._id }, "Rahul2698")
    return token

}

module.exports = mongoose.model("User", userSchema)