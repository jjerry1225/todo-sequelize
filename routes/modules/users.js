// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();

const passport = require("passport");
const bcrypt = require('bcryptjs')

// 根據 models/index.js 裡的流程，Sequelize 會先進入 models 資料夾，再透過 file system 去讀取資料夾內的特定 model，記得第一行要先載入資料夾。
const db = require("../../models")
const User = db.User

// 登入頁面
router.get("/login", (req, res) => {
  res.render("login")
})

// 登入
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login"
}))

// 註冊頁面
router.get("/register", (req, res) => {
  res.render("register")
})

// 註冊
router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors= [];
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "所有欄位都是必填。" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符。' })
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push({ message: 'This email already exists!' });
      return res.render("register", {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect("/"))
      .catch(error => console.log(error))
  })
})

// 登出
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "您已成功登出。");
  res.redirect("/users/login");
})

module.exports = router