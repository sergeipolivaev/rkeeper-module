require("dotenv").config();
const express = require("express");
const http = require("http");
const logger = require("volleyball");
const path = require("path");

const routes = require("./routes");
const { start } = require("./demonXml");

const { IP, PORT, IPKASSA, PORTKASSA, DISCOUNTID, DISCOUNTIDPAY } = process.env;

const ipServer = IP || "0.0.0.0";
const portServer = PORT || 9056;
const ipKassa = IPKASSA;
const portKassa = PORTKASSA;
const discountId = DISCOUNTID;
const discountIdPay = DISCOUNTIDPAY;

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

start(path.resolve("./xml"), ipKassa, portKassa, discountId, discountIdPay);

function defaultContentTypeMiddleware (req, res, next) {
  req.headers["content-type"] = req.headers["content-type"] || "application/json";
  next();
}
