const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(express.json())
app.use(cors())


app.use("*", (req, res) => {

    res.json({file: getFile()})
})


app.listen(4000, () =>{

})


const getFile = () => {
    return fs.readFileSync("losientobb.mp3") 
}
getFile()
