const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const { default: mongoose } = require("mongoose")
const AllRouters = require("./routes/index")
const flash = require("express-flash")
const session = require("express-session")
const { notFoundError, errorHandler } = require("./utils/error-handling")
const passport = require("passport")
const { passportInit } = require("./passport.config")

const app = express()

mongoose.connect("mongodb://localhost:27017/passport-js", {})
    .then(() => console.log("connected to mongodb"))
    .catch(err => console.log(err))

// setup application
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// setup view engine & layout
app.use(expressLayouts)
app.set("view engine", "ejs")
app.set("layout", "./layout/main.ejs")

// setup session
app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

// setup passport
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// Routers
app.use(AllRouters(passport))
app.use(notFoundError)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))