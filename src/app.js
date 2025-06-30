const express = require("express");
const app = express();


// Route for "/server"
app.use("/server", (req, res) => {
    res.send("Hello Server");
});


// Route for "/"
app.use("/", (req, res) => {
    res.send("Hello from the Dashboard");
});



app.listen(3000, () => {
    console.log("Server is Running successfully in port 3000")
})