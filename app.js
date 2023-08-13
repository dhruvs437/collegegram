const express = require("express");
const app = express();
const port = process.env.port||5100;
const mongoose = require("mongoose");
const {mongoUrl}=require("./keys")
//to eliminate cors policy which occurs beacuse of different domain of fronted and backend
const cors=require("cors");
app.use(cors())
const path =require("path")

require('./models/model')
require('./models/post')
app.use(express.json());
app.use(require("./routes/auth"))
app.use(require('./routes/createPost'))
app.use(require('./routes/user'));
// let mongoUrl = process.env.MONGOURL
mongoose.connect(mongoUrl);

//serving the frontend
app.use(express.static(path.join(__dirname,"./frontend/build")))

app.get("*",(req,res)=>{
  res.sendFile(
    path.join(__dirname,"./frontend/build/index.html"),
    function(err)
    {
      res.status(500).send(err)
    }
    )
})
app.listen(port, () => {
  console.log("server is running " + port);
});

//to check database is connected or not
mongoose.connection.on("connected",()=>{
    console.log("successfully sonnected to mongo")
})
//checking error if database is not connected
mongoose.connection.on("error",()=>{
    console.log("Not connected")
})
