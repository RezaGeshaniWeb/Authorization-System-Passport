const router = require("express").Router()

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
        user: { _id: '', fullName: '', username: '' }
    })
})

module.exports = { router }