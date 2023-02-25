const express = require("express")
const router = express.Router()

const { authenticator } = require("../middleware/auth")

// 引入模組程式碼
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')
const auth = require('./modules/auth')

// 將網址結構符合要求字串的 request 導向對應模組
router.use('/todos', authenticator, todos)  // 加入驗證程序，需登入才可進入todos路由
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)        // 加入驗證程序，最寬鬆的路由移至最下方，避免影響其他路由運作。

module.exports = router