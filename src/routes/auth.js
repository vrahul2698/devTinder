const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {

    // Manual way of pushing Data
    const { firstName, lastName, emailId, password } = req?.body;

    try {
        validateSignUpData(req);

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User Added Successfully")
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }

})


authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req?.body;

        const user = await User?.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid Credentials")
        }
        const passwordCompare = await user.validatePassword(password);
        if (!passwordCompare) {
            throw new Error("Invalid Credentials")
        } else {
            const token = await user.getJWT();
            res.cookie("token", token)
            res.send("Login Successfull")
        }

    }
    catch (err) {
        res.status(400).send("Error :" + err.message)
    }
})

// logout API
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out Successful")
})



module.exports = authRouter;