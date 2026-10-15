import pool from "../db/pool.js";
import { hash } from "bcryptjs";

async function indexGet(req, res) {
  res.render("index", { user: req.user });
};

async function signupGet(req, res) {
    res.render("sign-up")
};

async function signupPost(req, res, next) {
  const hashedPassword = await hash(req.body.password, 10);
  try {
    await pool.query("INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)", [
      req.body.first_name,
      req.body.last_name,
      req.body.username,
      hashedPassword
    ]);
    res.redirect("/");
  } catch(err) {
    return next(err);
  }
};



export {indexGet, signupGet, signupPost};