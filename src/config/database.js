const mongoose = require("mongoose");


const connectDB = async () => {
    // await mongoose.connect("mongodb+srv://rahulNodeJs:rahul2698@noderahul.gfhkgjz.mongodb.net/devTinder")
    await mongoose.connect("mongodb+srv://rahulv:rahuldevtinder2@devtinder.znniqlb.mongodb.net/devTinder")
}

module.exports= connectDB;

