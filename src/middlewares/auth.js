const jwttoken = require("jsonwebtoken");
const User = require("../model/user")


const AuthSignin = async (req, res, next) => {
    try {
     const { token } = req.cookies;
        if (!token) {
           return res.status(401).send("Please Login.!")
        }
        
        const checkJwt = await jwttoken.verify(token, process.env.JWT_TOKEN_PASSWORD);
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