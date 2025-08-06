const jwttoken = require("jsonwebtoken");
const User = require("../model/user")


const AuthSignin = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies) {
            throw new Error("Invalid Token")
        }
        const { token } = cookies;
        const checkJwt = await jwttoken.verify(token, "Rahul2698");
        const userCheck = await User.findById(checkJwt._id);
        if (!userCheck) {
            throw new Error("User Doesn't Exist")
        }
        req.user = userCheck;
        next();

    }
    catch (err) {
        res.status(400).send("Error 1: " + err.message)
    }
};
module.exports={
    AuthSignin
}