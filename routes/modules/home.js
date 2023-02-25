// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 根據 models/index.js 裡的流程，Sequelize 會先進入 models 資料夾，再透過 file system 去讀取資料夾內的特定 model，記得第一行要先載入資料夾。
const db = require("../../models")
const Todo = db.Todo
const User = db.User

// 首頁
router.get("/", (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) {req.flash('warning_msg', 'User not found')}

      return Todo.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
      })
    })
    .then((todos) => { return res.render("index", {todos: todos}) })
    .catch((error) => { return res.status(422).json(error) })
})

// 匯出路由模組
module.exports = router