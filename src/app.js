const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./model/user")


app.post("/signup", async (req, res) => {

    // Manual way of pushing Data
    const user = new User({
        firstName: "Rahul",
        lastName: "Belwin",
        emailId: "Vrahul@123.com",
        password: "123456"
    });
    try {
        await user.save();
        res.send("User Added Successfully")
    }
    catch (err) {
        res.status(400).send("Error Saving Data", err.message)
    }

})


connectDB().then(() => {
    console.log("DataBase Connected Successfully")
    app.listen(3000, () => {
        console.log("Server is Running successfully in port 3000")
    })
}

).catch((err) => { console.error("DataBase connection Failed", err) }
)


