const { Router } = require('express')
const  routCon  = require('../controller/userController.js')

const router = Router()


router.get('/signup', routCon.signup_get )
router.post('/signup', routCon.signup_post)
router.get('/login', routCon.login_get)
router.post('/login', routCon.login_post)
router.get('/logout', routCon.logout_get)

module.exports = router;