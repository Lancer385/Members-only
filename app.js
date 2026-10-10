const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const PORT = process.env.PORT || 8000;
const assetsPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "views");

if (process.env.NODE_ENV !== "production") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer({
    exts: ["css", "js", "ejs"],
  });
  liveReloadServer.watch([assetsPath, viewsPath]);
  app.use(connectLiveReload());
};
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(assetsPath));
app.use("/", indexRouter);


app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening to port: ${PORT}`);
  console.log(`Go to : http://localhost:${PORT}/`);
});
