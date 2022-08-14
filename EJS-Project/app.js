const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const app = express()

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

const item = ["Prep", "Cook", "Eat"]
const workItems = []

app.get("/", (req, res)=>{    
    let day = date.getDate()
    res.render("index", {listTitle: day, newListItem: item})
})

app.post("/", (req, res) => {
    item.push(req.body.newItem)

    res.redirect("/")
})

app.get("/work", (req, res) => {
    res.render("index.ejs", {listTitle: "Work List", newListItem: workItems})
})
app.post("/work", (req, res) => {
    workItems.push(req.body.newItem)
    res.redirect("/work")
})
app.listen(3000, () => {
    console.log("Server listening on port 3000");
})
