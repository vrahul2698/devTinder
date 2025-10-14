require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const jwttoken = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connectionRequest")
const userRouter = require('./routes/user');
const cors = require("cors");
const paymentRouter = require("./routes/payment");
const http = require("http");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

require("./utils/cronJob");
app.use(cors({
    origin: "http://localhost:5173",   // your frontend URL
    credentials: true,

}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", connectionRouter)
app.use("/", userRouter)
app.use("/", paymentRouter)
app.use("/", chatRouter)


const server = http.createServer(app)
initializeSocket(server);



connectDB().then(() => {
    console.log("DataBase Connected Successfully")
    server.listen(process.env.PORT, () => {
        console.log("Server is Running successfully in port 3000")
    })
}

).catch((err) => { console.error("DataBase connection Failed", err) }
)


