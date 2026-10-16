import express from "express";
import { join } from "node:path";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import indexRouter from "./routes/indexRouter.js";
import "dotenv/config";
import "./utils/passport.js";
import sessionConfigs from "./utils/session.js";

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
}

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(session(sessionConfigs));

app.use(passport.session());

app.use("/", indexRouter);

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
  }),
);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening to port: ${PORT}`);
  console.log(`Go to : http://localhost:${PORT}/`);
});
