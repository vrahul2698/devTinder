const validator = require("validator")
const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req?.body;

    if (!firstName || !lastName) {
        console.log("1")
        throw new Error("Please Enter Name")
    } else if (!validator.isEmail(emailId)) {
        console.log("2")
        throw new Error("Enter Valid EMail")
    }
    else if (!validator.isStrongPassword(password)) {
        console.log("3")
        throw new Error("Password is not strong")
    }

};

const validateProfileDetails = (req) => {
    const AcceptedEditFields = ["firstName", "lastName", "emailId", "skills", "age", "gender"]
    const isValid = Object.keys(req.body).every(field => (AcceptedEditFields?.includes(field)));
    return isValid
}

module.exports = {
    validateSignUpData,
    validateProfileDetails
}