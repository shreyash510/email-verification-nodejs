const express = require("express");
const app = express();
// const User = require("../model/userSchema");
const authRoute = require("../routes/auth");

require("../db/conn");
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(authRoute);


app.get('/', (req, res)=>{
    res.send('this is home page')
})
app.get("/userData", (req, res) => {
    res.send("about")
})
app.get("/UserVerification", (req, res) => {
    res.send("contact")
})

app.listen(port, () => {
    console.log(`listening...${port}`);
})