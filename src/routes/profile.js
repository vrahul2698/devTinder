const express = require("express");
const profileRouter = express.Router();

const { AuthSignin } = require("../middlewares/auth");
const { validateProfileDetails } = require("../utils/validation")

// Profile section 
profileRouter.get("/profile", AuthSignin, async (req, res) => {
    try {
        const user = req?.user
        res.send(user)

    }
    catch (err) {
        res.status(400).send("Error :" + err.message)
    }

})


// profile details edit except password
profileRouter.patch("/profile/edit", AuthSignin, async (req, res) => {
    try {
        const Valid = validateProfileDetails(req);
        if (!Valid) {
            throw new Error("Edit Fields not allowed")
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
        await loggedInUser.save();

        res.json({message:`${loggedInUser?.firstName} , your profile updated successfully` , data : loggedInUser})
    }
    catch (err) {
        res.status(400).send("Error :" + err.message)
    }
})

module.exports = profileRouter;