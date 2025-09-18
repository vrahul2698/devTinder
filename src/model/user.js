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
    about: {
        type: "String"
    },
    gender: {
        type: "String"
    },
    photoUrl: {
        type: "String",
        default:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },
    emailId: {
        type: "String",
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: "String"
    },
    skills: {
        type: ["String"]
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

// userSchema.indexes({ emailId: 1 })
module.exports = mongoose.model("User", userSchema)