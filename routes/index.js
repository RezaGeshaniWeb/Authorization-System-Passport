const router = require("express").Router()
const { userModel } = require("../model/user.model")

router.get('/', (req, res) => {
    res.render('index', { title: 'home' })
})

router.get('/login', (req, res) => {
    res.render('login', { title: 'login' })
})

router.get('/register', (req, res) => {
    res.render('register', { title: 'register' })
})

router.get('/profile', (req, res) => {
    res.render('profile', {
        title: 'profile',
        user: { _id: '', fullname: '', username: '' }
    })
})

router.post('/register', async (req, res, next) => {
    try {
        const { fullname: fullName, username, password } = req.body
        const hashPassword = hashSync(password, 10)
        const user = await userModel.findOne({ username })
        if (user) {
            const referrer = req.header("Referrer") ?? req.headers.referer
            req.flash("error", "this username already exist")
            return res.redirect(referrer ?? "/register")
        }
        await userModel.create({ fullName, username, password })
        res.redirect("/login")
    } catch (error) {
        next(error)
    }
})

module.exports = { router }