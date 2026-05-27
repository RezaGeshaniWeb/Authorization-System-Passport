const router = require("express").Router()
const { hashSync } = require("bcrypt")
const { redirectIfIsAuth, checkAuth } = require("../middleware/check-auth")
const { userModel } = require("../model/user.model")

function initRoutes(passport) {
    router.get('/', (req, res) => {
        res.render('index', { title: 'home' })
    })

    router.get('/login', redirectIfIsAuth, (req, res) => {
        res.render('login', {
            title: 'login', message: {
                error: req.flash("error")
            }
        })
    })

    router.get('/register', redirectIfIsAuth, (req, res) => {
        res.render('register', {
            title: 'register', message: {
                error: req.flash("error")
            }
        })
    })

    router.get('/profile', checkAuth, (req, res) => {
        const user = req.user
        res.render('profile', { title: 'profile', user })
    })

    router.get('/logout', checkAuth, (req, res) => {
        req.logOut({ keepSessionInfo: false }, (err) => {
            if (err) console.log(err)
        })
        res.redirect("/login")
    })

    router.post('/register', redirectIfIsAuth, async (req, res, next) => {
        try {
            const { fullname: fullName, username, password } = req.body
            const hashPassword = hashSync(password, 10)
            const user = await userModel.findOne({ username })
            if (user) {
                const referrer = req.header("Referrer") ?? req.headers.referer
                req.flash("error", "this username already exist")
                return res.redirect(referrer ?? "/register")
            }
            await userModel.create({ fullName, username, password: hashPassword })
            res.redirect("/login")
        } catch (error) {
            next(error)
        }
    })

    router.post('/login', redirectIfIsAuth, passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true,
    }))

    return router
}

module.exports = initRoutes