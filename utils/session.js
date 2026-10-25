import pool from "../db/pool.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool: pool,
  tableName: process.env.SESSION_TABLE,
});
const sessionConfigs = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000,
  },
};

export default sessionConfigs;
