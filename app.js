import express from "express";
import { join } from "node:path";
import path from "path";
import { fileURLToPath } from "url";
import { compare } from "bcryptjs";
import { Strategy as LocalStrategy } from 'passport-local';
import session from "express-session";
import passport from "passport";
import pool from "./db/pool.js";
import connectPgSimple from "connect-pg-simple";
import indexRouter from "./routes/indexRouter.js";
import "dotenv/config";
import { getUserByID, getUserByUsername } from "./db/queries.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8000;
const assetsPath = join(__dirname, "public");
const viewsPath = join(__dirname, "views");


if (process.env.NODE_ENV !== "production") {
  const { default: livereload } = await import("livereload");
  const { default: connectLiveReload } = await import("connect-livereload");

  const liveReloadServer = livereload.createServer({
    exts: ["css", "js", "ejs"],
  });
  liveReloadServer.watch([assetsPath, viewsPath]);
  app.use(connectLiveReload());
};
const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool: pool, 
  tableName: process.env.SESSION_TABLE
});

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ 
  store: sessionStore, 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.session());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await compare(password, user.password)
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserByID(id);
    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.use("/", indexRouter);

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
  }) 
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening to port: ${PORT}`);
  console.log(`Go to : http://localhost:${PORT}/`);
});
