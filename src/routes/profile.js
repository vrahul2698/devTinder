const express = require("express");
const profileRouter = express.Router();

const { AuthSignin } = require("../middlewares/auth");

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

module.exports = profileRouter;