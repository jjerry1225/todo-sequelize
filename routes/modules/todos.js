// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 根據 models/index.js 裡的流程，Sequelize 會先進入 models 資料夾，再透過 file system 去讀取資料夾內的特定 model，記得第一行要先載入資料夾。
const db = require("../../models")
const Todo = db.Todo

// 新增頁面
router.get("/new", (req, res) => {
  res.render("new")
})

// 新增
router.post("/", (req, res) => {
  const UserId = req.user.id
  const name = req.body.name; // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name, UserId }) // 存入資料庫
    .then(() => {
      res.redirect("/");
    }) // 新增完成後導回首頁
    .catch((error) => console.error(error));
});

// 瀏覽詳細資訊
router.get("/:id", (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: {id, UserId} })
    .then(todo => res.render("detail", { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// 進入編輯頁面
router.get("/:id/edit", (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: {id, UserId} })
    .then(todo => res.render("edit", { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// 編輯
router.put("/:id", (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body

  return Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'  // 此段語法等於如下條件式
      // if (isDone === 'on') {
      //   todo.isDone = true
      // } else {
      //   todo.isDone = false
      // }
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

// 刪除
router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id

  return Todo.findOne({ where: { id, UserId } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router