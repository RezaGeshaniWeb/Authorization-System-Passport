const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const { default: mongoose } = require("mongoose")

const app = express()

mongoose.connect("mongodb://localhost:27017/passport-js", {}).then(() => {
    console.log("connected to mongodb")
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressLayouts)
app.set("view engine", "ejs")
app.set("layout", "./layout/main.ejs")

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))