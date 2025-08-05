const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAuthorized = token === "xyz";
    console.log("Admin Authorization Running")
    if (!isAuthorized) {
        res.status(401).send("UnAuthorized Admin")
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    const token = "xyzhshsh";
    const isAuthorized = token === "xyz";
    console.log("User Authorization Running")
    if (!isAuthorized) {
        res.status(401).send("UnAuthorized User")
    } else {
        next();
    }
}

module.exports={
    adminAuth , userAuth
}