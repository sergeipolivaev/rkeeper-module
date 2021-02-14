require("dotenv").config();
const express = require("express");
const http = require("http");
const logger = require("volleyball");
const path = require("path");

const routes = require("./routes");
const { start } = require("./demonXml");

const args = process.argv;
const addressServer = args[2];
const addressKassa = args[3];
const discountId = args[4];

const addressServerSplitted = addressServer.split(":");
const addressKassaSplitted = addressKassa.split(":");

const ipServer = addressServerSplitted[0] || "0.0.0.0";
const portServer = addressServerSplitted[1] || 9056;
const ipKassa = addressKassaSplitted[0];
const portKassa = addressKassaSplitted[1];

const server = http.createServer;
const app = express();

app.set("port", portServer || 9056);
app.set("ip", ipServer || "0.0.0.0");

app.use(defaultContentTypeMiddleware);
app.use(logger);
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

server(app).listen(app.get("port"), app.get("ip"), (err) => {
  if (err) throw err;
  console.log("Server is running at localhost:%d in %s mode", app.get("port"), app.get("env"));
  console.log("Press CTRL-C to stop\n");
});

start(path.resolve("./xml"), ipKassa, portKassa);

function defaultContentTypeMiddleware (req, res, next) {
  req.headers["content-type"] = req.headers["content-type"] || "application/json";
  next();
}
