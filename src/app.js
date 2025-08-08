const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const jwttoken = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connectionRequest")

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", connectionRouter)





connectDB().then(() => {
    console.log("DataBase Connected Successfully")
    app.listen(3000, () => {
        console.log("Server is Running successfully in port 3000")
    })
}

).catch((err) => { console.error("DataBase connection Failed", err) }
)


