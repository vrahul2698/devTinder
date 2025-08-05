const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://rahulNodeJs:rahul2698@noderahul.gfhkgjz.mongodb.net/devTinder")
}

module.exports= connectDB;

